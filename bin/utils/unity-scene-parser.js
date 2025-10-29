/**
 * Unity Scene Parser Utilities
 *
 * Common utilities for parsing Unity scene files (.unity) and extracting
 * accessibility-related information for WCAG compliance analysis.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

/**
 * Find all Unity scene files in a project
 * @param {string} projectPath - Root path of Unity project
 * @returns {Array<{name: string, path: string}>} Array of scene file objects
 */
export function findSceneFiles(projectPath) {
  const scenesDir = path.join(projectPath, 'Assets', 'Scenes');
  const files = [];

  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
        searchDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.unity')) {
        files.push({
          name: item.replace('.unity', ''),
          path: fullPath
        });
      }
    }
  }

  // Start searching from Assets directory
  const assetsDir = path.join(projectPath, 'Assets');
  if (fs.existsSync(assetsDir)) {
    searchDirectory(assetsDir);
  }

  return files;
}

/**
 * Parse a Unity scene file (YAML format)
 * @param {string} scenePath - Path to .unity scene file
 * @returns {Object} Parsed scene data
 */
export function parseUnityScene(scenePath) {
  if (!fs.existsSync(scenePath)) {
    throw new Error(`Scene file not found: ${scenePath}`);
  }

  const content = fs.readFileSync(scenePath, 'utf-8');

  // Unity scene files are YAML documents separated by ---
  const documents = content.split(/^---$/m).filter(doc => doc.trim());

  const gameObjects = [];
  const components = {};

  for (const doc of documents) {
    try {
      const parsed = yaml.parse(doc);

      if (!parsed) continue;

      // Extract GameObjects
      if (parsed.GameObject) {
        gameObjects.push(parsed.GameObject);
      }

      // Extract components (MonoBehaviour, Transform, etc.)
      for (const [key, value] of Object.entries(parsed)) {
        if (key !== 'GameObject' && value) {
          if (!components[key]) {
            components[key] = [];
          }
          components[key].push(value);
        }
      }
    } catch (err) {
      // Skip invalid YAML documents
      continue;
    }
  }

  return {
    gameObjects,
    components,
    raw: content
  };
}

/**
 * Find GameObjects by name pattern
 * @param {Object} sceneData - Parsed scene data from parseUnityScene
 * @param {string|RegExp} pattern - Name pattern to match
 * @returns {Array} Matching GameObjects
 */
export function findGameObjectsByName(sceneData, pattern) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
  return sceneData.gameObjects.filter(go => go.m_Name && regex.test(go.m_Name));
}

/**
 * Find all UI Text and TextMeshPro components
 * @param {Object} sceneData - Parsed scene data
 * @returns {Array} Text components with associated GameObject info
 */
export function findTextComponents(sceneData) {
  const textComponents = [];

  // Find UI.Text components
  if (sceneData.components.MonoBehaviour) {
    for (const component of sceneData.components.MonoBehaviour) {
      if (component.m_Script &&
          (component.m_Script.guid === '5f7201a12d95ffc409449d95f23cf332' || // UI.Text
           component.m_Script.fileID === '708705254')) { // TextMeshProUGUI
        textComponents.push({
          type: 'Text',
          text: component.m_Text || '',
          gameObjectId: component.m_GameObject?.fileID,
          component: component
        });
      }
    }
  }

  return textComponents;
}

/**
 * Find GameObject by fileID
 * @param {Object} sceneData - Parsed scene data
 * @param {string} fileID - GameObject fileID
 * @returns {Object|null} GameObject or null
 */
export function findGameObjectByFileID(sceneData, fileID) {
  return sceneData.gameObjects.find(go => go.m_FileID === fileID) || null;
}

/**
 * Check if GameObject has component of specific type
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject fileID
 * @param {string} componentType - Component type name
 * @returns {boolean}
 */
export function hasComponent(sceneData, gameObjectId, componentType) {
  if (!sceneData.components[componentType]) return false;

  return sceneData.components[componentType].some(
    component => component.m_GameObject?.fileID === gameObjectId
  );
}

/**
 * Find all interactive UI elements (Buttons, Toggles, Sliders, etc.)
 * @param {Object} sceneData - Parsed scene data
 * @returns {Array} Interactive elements
 */
export function findInteractiveElements(sceneData) {
  const interactive = [];

  // Find Button components
  if (sceneData.components.MonoBehaviour) {
    for (const component of sceneData.components.MonoBehaviour) {
      if (component.m_Script) {
        const scriptGuid = component.m_Script.guid;

        // Common Unity UI component GUIDs
        const interactiveGUIDs = {
          'd0b148fe25e99eb48b9724523833bab1': 'Button',
          '9085e5bfcb8e48a4394ba301aaa7a8f5': 'Toggle',
          '1863c70b1e5f4c24a8c2f6a5a1b7e0f5': 'Slider',
          '1e7e5e4d2c0a3b8a4d5f6a3b4c5d6e7f': 'InputField'
        };

        const componentType = interactiveGUIDs[scriptGuid];
        if (componentType) {
          interactive.push({
            type: componentType,
            gameObjectId: component.m_GameObject?.fileID,
            component: component
          });
        }
      }
    }
  }

  return interactive;
}

/**
 * Find Canvas component
 * @param {Object} sceneData - Parsed scene data
 * @returns {Object|null} Canvas component or null
 */
export function findCanvas(sceneData) {
  if (!sceneData.components.Canvas) return null;
  return sceneData.components.Canvas[0] || null;
}

/**
 * Get Transform/RectTransform position and size
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject fileID
 * @returns {Object|null} Position and size info
 */
export function getTransform(sceneData, gameObjectId) {
  // Check for RectTransform (UI elements)
  if (sceneData.components.RectTransform) {
    const rectTransform = sceneData.components.RectTransform.find(
      rt => rt.m_GameObject?.fileID === gameObjectId
    );

    if (rectTransform) {
      return {
        type: 'RectTransform',
        position: rectTransform.m_LocalPosition,
        anchoredPosition: rectTransform.m_AnchoredPosition,
        sizeDelta: rectTransform.m_SizeDelta,
        anchorMin: rectTransform.m_AnchorMin,
        anchorMax: rectTransform.m_AnchorMax,
        pivot: rectTransform.m_Pivot
      };
    }
  }

  // Check for regular Transform (3D objects)
  if (sceneData.components.Transform) {
    const transform = sceneData.components.Transform.find(
      t => t.m_GameObject?.fileID === gameObjectId
    );

    if (transform) {
      return {
        type: 'Transform',
        position: transform.m_LocalPosition,
        rotation: transform.m_LocalRotation,
        scale: transform.m_LocalScale
      };
    }
  }

  return null;
}

/**
 * Convert Unity RectTransform to pixel dimensions
 * @param {Object} rectTransform - RectTransform data
 * @param {Object} canvas - Canvas data
 * @returns {Object} Width and height in pixels
 */
export function convertUnityRectToPixels(rectTransform, canvas) {
  // Default reference resolution (common Unity setup)
  const referenceResolution = canvas?.m_ReferenceResolution || { x: 1920, y: 1080 };
  const scaleFactor = canvas?.m_ScaleFactor || 1;

  // Simple calculation: sizeDelta is the size in Unity units
  // For most UI, 1 Unity unit = 1 pixel at reference resolution
  const width = Math.abs(rectTransform.sizeDelta?.x || rectTransform.m_SizeDelta?.x || 0) * scaleFactor;
  const height = Math.abs(rectTransform.sizeDelta?.y || rectTransform.m_SizeDelta?.y || 0) * scaleFactor;

  return { width, height };
}
