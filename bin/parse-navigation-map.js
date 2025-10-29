#!/usr/bin/env node

/**
 * Navigation Map Parser - Phase 1 of Hybrid Option D
 *
 * Extracts scene navigation structure from Unity project source code (read-only).
 * Creates a navigation graph showing how scenes connect to each other via NavigationObject buttons.
 *
 * Success Criteria:
 * - ✅ Identifies all scenes from EditorBuildSettings.asset
 * - ✅ Finds navigation buttons (NavigationObjects) in scenes
 * - ✅ Maps scene transitions (navigation graph)
 * - ✅ Extracts approximate button positions
 *
 * Output: AccessibilityAudit/navigation-map.json
 *
 * Usage:
 *   node bin/parse-navigation-map.js <unity-project-path>
 *
 * Example:
 *   node bin/parse-navigation-map.js "C:\Users\Jill\OneDrive\Documents\GitHub\apps.career-explorer"
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

/**
 * Parse a Unity scene file (with custom handling for Unity YAML tags)
 * @param {string} scenePath - Path to .unity scene file
 * @returns {Array} Array of parsed YAML documents
 */
function parseUnitySceneFile(scenePath) {
  if (!fs.existsSync(scenePath)) {
    throw new Error(`Scene file not found: ${scenePath}`);
  }

  const content = fs.readFileSync(scenePath, 'utf-8');
  const documents = [];

  // Split by document separator (---)
  const parts = content.split(/^---\s+/m).filter(doc => doc.trim());

  for (const part of parts) {
    try {
      // Remove Unity YAML tags (e.g., !u!114 &12345)
      // but preserve the anchor reference (&12345)
      const cleaned = part.replace(/!u!\d+\s+(&\d+)/, '$1');

      const parsed = yaml.parse(cleaned);

      if (parsed && typeof parsed === 'object') {
        documents.push(parsed);
      }
    } catch (err) {
      // Skip invalid YAML documents
      continue;
    }
  }

  return documents;
}

/**
 * Get Transform position from scene documents
 * @param {Array} documents - Parsed scene documents
 * @param {string} gameObjectId - GameObject fileID
 * @returns {Object|null} Position data
 */
function getTransformPosition(documents, gameObjectId) {
  for (const doc of documents) {
    if (doc.Transform && doc.Transform.m_GameObject?.fileID === gameObjectId) {
      return {
        type: 'Transform',
        position: doc.Transform.m_LocalPosition,
        rotation: doc.Transform.m_LocalRotation,
        scale: doc.Transform.m_LocalScale
      };
    }
    if (doc.RectTransform && doc.RectTransform.m_GameObject?.fileID === gameObjectId) {
      return {
        type: 'RectTransform',
        position: doc.RectTransform.m_LocalPosition,
        anchoredPosition: doc.RectTransform.m_AnchoredPosition
      };
    }
  }
  return null;
}

/**
 * Parse EditorBuildSettings.asset to get all scene paths
 * @param {string} projectPath - Unity project root path
 * @returns {Array<{path: string, name: string, enabled: boolean}>}
 */
function parseEditorBuildSettings(projectPath) {
  const buildSettingsPath = path.join(projectPath, 'ProjectSettings', 'EditorBuildSettings.asset');

  if (!fs.existsSync(buildSettingsPath)) {
    console.error(`❌ EditorBuildSettings.asset not found at: ${buildSettingsPath}`);
    return [];
  }

  const content = fs.readFileSync(buildSettingsPath, 'utf-8');
  const parsed = yaml.parse(content);

  const scenes = [];

  if (parsed.EditorBuildSettings && parsed.EditorBuildSettings.m_Scenes) {
    for (const scene of parsed.EditorBuildSettings.m_Scenes) {
      const sceneName = path.basename(scene.path, '.unity');
      scenes.push({
        path: scene.path,
        name: sceneName,
        enabled: scene.enabled === 1,
        guid: scene.guid
      });
    }
  }

  console.log(`✅ Found ${scenes.length} scenes in EditorBuildSettings.asset`);
  return scenes;
}

/**
 * Find all .meta files and create GUID to file path mapping
 * @param {string} projectPath - Unity project root path
 * @returns {Map<string, string>} Map of GUID to asset file path
 */
function buildGuidToAssetMap(projectPath) {
  const guidMap = new Map();
  const assetsDir = path.join(projectPath, 'Assets');

  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
        searchDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.meta')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const guidMatch = content.match(/^guid:\s*([a-f0-9]+)$/m);

        if (guidMatch) {
          const guid = guidMatch[1];
          // Get the corresponding asset file (remove .meta extension)
          const assetPath = fullPath.replace('.meta', '');
          guidMap.set(guid, assetPath);
        }
      }
    }
  }

  searchDirectory(assetsDir);
  console.log(`✅ Built GUID map with ${guidMap.size} entries`);
  return guidMap;
}

/**
 * Parse a SceneDefinition asset file
 * @param {string} assetPath - Path to .asset file
 * @returns {Object|null} SceneDefinition data or null
 */
function parseSceneDefinition(assetPath) {
  if (!fs.existsSync(assetPath)) {
    return null;
  }

  const content = fs.readFileSync(assetPath, 'utf-8');
  const parsed = yaml.parse(content);

  if (parsed.MonoBehaviour) {
    return {
      id: parsed.MonoBehaviour.id,
      sceneName: parsed.MonoBehaviour.sceneName,
      displayNameKey: parsed.MonoBehaviour.displayNameKey,
      assetPath: assetPath
    };
  }

  return null;
}

/**
 * Find prefab files in the project
 * @param {string} projectPath - Unity project root path
 * @returns {Array<string>} Array of prefab file paths
 */
function findPrefabFiles(projectPath) {
  const prefabs = [];
  const assetsDir = path.join(projectPath, 'Assets');

  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
        searchDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.prefab')) {
        prefabs.push(fullPath);
      }
    }
  }

  searchDirectory(assetsDir);
  return prefabs;
}

/**
 * Find NavigationObject components in a Unity scene
 * @param {string} projectPath - Unity project root path
 * @param {string} scenePath - Relative path to scene file
 * @param {Map} guidMap - GUID to asset path mapping
 * @returns {Array<Object>} NavigationObject data
 */
function findNavigationObjects(projectPath, scenePath, guidMap) {
  const fullScenePath = path.join(projectPath, scenePath);

  if (!fs.existsSync(fullScenePath)) {
    console.warn(`⚠️  Scene file not found: ${fullScenePath}`);
    return [];
  }

  const documents = parseUnitySceneFile(fullScenePath);
  const navigationObjects = [];

  // Known GUID for NavigationObject.cs script
  // We need to find this dynamically by searching for the script
  const navigationObjectGuid = findScriptGuid(projectPath, 'NavigationObject.cs');

  if (!navigationObjectGuid) {
    console.warn(`⚠️  NavigationObject.cs script GUID not found`);
    return [];
  }

  console.log(`   NavigationObject.cs GUID: ${navigationObjectGuid}`);

  // Find MonoBehaviour components that use NavigationObject script
  const monoBehaviours = documents.filter(doc => doc.MonoBehaviour);
  console.log(`   Total MonoBehaviour components: ${monoBehaviours.length}`);

  let matchCount = 0;
  let withSceneDefCount = 0;
  for (const doc of monoBehaviours) {
    const component = doc.MonoBehaviour;

    if (component.m_Script && component.m_Script.guid === navigationObjectGuid) {
      matchCount++;
      // Found a NavigationObject component
      const sceneDefGuid = component.SceneDefinition?.guid;

      // Get transform/position data
      const gameObjectId = component.m_GameObject?.fileID;
      const transform = gameObjectId ? getTransformPosition(documents, gameObjectId) : null;

      if (sceneDefGuid) {
        withSceneDefCount++;
        const sceneDefPath = guidMap.get(sceneDefGuid);
        const sceneDefinition = sceneDefPath ? parseSceneDefinition(sceneDefPath) : null;

        navigationObjects.push({
          gameObjectId: gameObjectId,
          sceneDefinitionGuid: sceneDefGuid,
          targetScene: sceneDefinition?.sceneName || null,
          position: transform?.position || null,
          hoverTextOffset: component.hoverTextOffset,
          allowNavigation: component.allowNavigation !== false
        });
      } else {
        // NavigationObject without SceneDefinition - might be disabled or template
        console.log(`      ⚠️  NavigationObject without SceneDefinition (GameObject: ${gameObjectId})`);
      }
    }
  }
  console.log(`   Matched NavigationObject components: ${matchCount} (${withSceneDefCount} with SceneDefinition)`);

  return navigationObjects;
}

/**
 * Find the GUID for a Unity C# script file
 * @param {string} projectPath - Unity project root path
 * @param {string} scriptName - Script file name (e.g., 'NavigationObject.cs')
 * @returns {string|null} GUID or null
 */
function findScriptGuid(projectPath, scriptName) {
  const assetsDir = path.join(projectPath, 'Assets');

  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return null;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
        const result = searchDirectory(fullPath);
        if (result) return result;
      } else if (stat.isFile() && item === scriptName) {
        // Found the script, now read its .meta file
        const metaPath = fullPath + '.meta';
        if (fs.existsSync(metaPath)) {
          const content = fs.readFileSync(metaPath, 'utf-8');
          const guidMatch = content.match(/^guid:\s*([a-f0-9]+)$/m);
          return guidMatch ? guidMatch[1] : null;
        }
      }
    }

    return null;
  }

  return searchDirectory(assetsDir);
}

/**
 * Build navigation graph from all scenes
 * @param {string} projectPath - Unity project root path
 * @returns {Object} Navigation map data
 */
function buildNavigationMap(projectPath) {
  console.log('\n🔍 Starting navigation map parsing...\n');

  // Step 1: Parse EditorBuildSettings.asset
  const scenes = parseEditorBuildSettings(projectPath);

  if (scenes.length === 0) {
    console.error('❌ No scenes found. Aborting.');
    return null;
  }

  // Step 2: Build GUID to asset map
  const guidMap = buildGuidToAssetMap(projectPath);

  // Step 3: Find prefabs with NavigationObjects (only check known navigation prefabs for performance)
  console.log('\n🔍 Scanning known navigation prefabs...');
  const prefabNavigationObjects = [];

  const navigationObjectGuid = findScriptGuid(projectPath, 'NavigationObject.cs');
  console.log(`   NavigationObject.cs GUID: ${navigationObjectGuid}`);

  // Known prefab paths that contain NavigationObjects (based on grep results)
  const knownNavPrefabs = [
    'Assets/Prefabs/map/Prefabs/BuildingsMain/Hotel.prefab',
    'Assets/Prefabs/map/Prefabs/BuildingsMain/InnovationHub.prefab',
    'Assets/Prefabs/map/Prefabs/BuildingsMain/SustainableFarm 1.prefab',
    'Assets/Prefabs/map/Prefabs/BuildingsMain/VehicleServiceCenter.prefab'
  ];

  for (const relativePath of knownNavPrefabs) {
    const prefabPath = path.join(projectPath, relativePath);

    if (!fs.existsSync(prefabPath)) {
      console.log(`   ⚠️  Prefab not found: ${relativePath}`);
      continue;
    }

    try {
      const documents = parseUnitySceneFile(prefabPath);
      const monoBehaviours = documents.filter(doc => doc.MonoBehaviour);

      for (const doc of monoBehaviours) {
        const component = doc.MonoBehaviour;

        if (component.m_Script && component.m_Script.guid === navigationObjectGuid) {
          const sceneDefGuid = component.SceneDefinition?.guid;

          if (sceneDefGuid) {
            const sceneDefPath = guidMap.get(sceneDefGuid);
            const sceneDefinition = sceneDefPath ? parseSceneDefinition(sceneDefPath) : null;

            prefabNavigationObjects.push({
              prefabPath: relativePath,
              targetScene: sceneDefinition?.sceneName || null,
              sceneDefinitionGuid: sceneDefGuid
            });
          }
        }
      }
    } catch (err) {
      console.log(`   ⚠️  Error parsing ${relativePath}: ${err.message}`);
      continue;
    }
  }

  console.log(`   Found ${prefabNavigationObjects.length} NavigationObject(s) in prefabs`);

  // Step 4: Parse each scene to find NavigationObjects
  const navigationGraph = {};

  for (const scene of scenes) {
    console.log(`\n📄 Analyzing scene: ${scene.name}`);

    const navigationObjects = findNavigationObjects(projectPath, scene.path, guidMap);

    console.log(`   Found ${navigationObjects.length} NavigationObject(s) in scene`);

    // Check if any prefabs with NavigationObjects might be used in this scene
    // (This is a simplified check - full implementation would parse prefab instances in scene)
    const potentialPrefabNavs = prefabNavigationObjects.filter(pNav => {
      const prefabName = path.basename(pNav.prefabPath, '.prefab');
      // Check if prefab name suggests it belongs to this scene
      return scene.name.toLowerCase().includes(prefabName.toLowerCase()) ||
             prefabName.toLowerCase().includes(scene.name.toLowerCase());
    });

    const allNavigationObjects = [
      ...navigationObjects.map(nav => ({
        targetScene: nav.targetScene,
        position: nav.position,
        allowNavigation: nav.allowNavigation,
        source: 'scene'
      })),
      ...potentialPrefabNavs.map(nav => ({
        targetScene: nav.targetScene,
        position: null,
        allowNavigation: true,
        source: 'prefab',
        prefabPath: nav.prefabPath
      }))
    ];

    navigationGraph[scene.name] = {
      scenePath: scene.path,
      enabled: scene.enabled,
      navigationButtons: allNavigationObjects
    };
  }

  // Add special handling for LocationSelect - it likely uses all location prefabs
  if (navigationGraph['LocationSelect']) {
    const locationPrefabs = prefabNavigationObjects.filter(pNav =>
      pNav.prefabPath.includes('BuildingsMain') || pNav.prefabPath.includes('Locations')
    );

    navigationGraph['LocationSelect'].navigationButtons = [
      ...navigationGraph['LocationSelect'].navigationButtons,
      ...locationPrefabs.map(nav => ({
        targetScene: nav.targetScene,
        position: null,
        allowNavigation: true,
        source: 'prefab',
        prefabPath: nav.prefabPath
      }))
    ];
  }

  // Step 5: Generate summary statistics
  const stats = {
    totalScenes: scenes.length,
    scenesWithNavigation: Object.values(navigationGraph).filter(s => s.navigationButtons.length > 0).length,
    totalNavigationButtons: Object.values(navigationGraph).reduce((sum, s) => sum + s.navigationButtons.length, 0)
  };

  console.log('\n📊 Navigation Map Statistics:');
  console.log(`   Total scenes: ${stats.totalScenes}`);
  console.log(`   Scenes with navigation: ${stats.scenesWithNavigation}`);
  console.log(`   Total navigation buttons: ${stats.totalNavigationButtons}`);

  return {
    projectPath: projectPath,
    generatedAt: new Date().toISOString(),
    statistics: stats,
    scenes: navigationGraph
  };
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Usage: node bin/parse-navigation-map.js <unity-project-path>');
    console.error('\nExample:');
    console.error('  node bin/parse-navigation-map.js "C:\\Users\\Jill\\OneDrive\\Documents\\GitHub\\apps.career-explorer"');
    process.exit(1);
  }

  const projectPath = args[0];

  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Project path does not exist: ${projectPath}`);
    process.exit(1);
  }

  // Build navigation map
  const navigationMap = buildNavigationMap(projectPath);

  if (!navigationMap) {
    console.error('\n❌ Failed to build navigation map');
    process.exit(1);
  }

  // Create output directory
  const outputDir = path.join(projectPath, 'AccessibilityAudit');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`\n📁 Created output directory: ${outputDir}`);
  }

  // Write output file
  const outputPath = path.join(outputDir, 'navigation-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(navigationMap, null, 2), 'utf-8');

  console.log(`\n✅ Navigation map saved to: ${outputPath}`);
  console.log('\n✨ Phase 1 complete!\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
