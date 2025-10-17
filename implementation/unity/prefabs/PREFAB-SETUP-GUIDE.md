# Unity Prefab Setup Guide - zSpace Accessibility

**Note:** Unity prefabs (.prefab files) must be created in Unity Editor, not as text files.

This guide shows how to create accessible zSpace prefabs using the C# scripts from `/implementation/unity/scripts/`.

---

## Prefab 1: AccessibleZSpaceButton (3D)

**Purpose:** Interactive 3D button with stylus + keyboard + mouse support

**Setup in Unity:**

1. **Create GameObject:**
   ```
   Hierarchy → Right-click → 3D Object → Cube
   Rename: "AccessibleButton3D"
   ```

2. **Add Components:**
   ```
   Inspector → Add Component:
   - Box Collider (for raycast/stylus detection)
   - Rigidbody → Set Is Kinematic: true
   - ZSpaceFocusIndicator (from scripts/)
   - StylusHapticFeedback (from scripts/)
   - DepthCueManager (from scripts/)
   ```

3. **Configure ZSpaceFocusIndicator:**
   ```
   Focus Type: Emissive Glow
   Focus Color: #3D97F1 (blue)
   Glow Intensity: 2.0
   Enable Pulse: true
   ```

4. **Configure DepthCueManager:**
   ```
   Enable Size Cue: true
   Enable Shadow Cue: true
   Enable Audio Cue: true (if AudioSource added)
   Enable Haptic Cue: true
   Closest Distance: 0.5
   Farthest Distance: 5.0
   ```

5. **Configure Material:**
   ```
   Create new Material: "ButtonMaterial_Standard"
   Shader: Standard
   Color: #9E9E9E (gray)
   Metallic: 0.2
   Smoothness: 0.5
   ```

6. **Add Interaction Script:**
   ```csharp
   // Create new script: ButtonInteraction.cs
   using UnityEngine;
   using zSpace.Core;

   public class ButtonInteraction : MonoBehaviour
   {
       private KeyboardStylusAlternative input;
       private ZSpaceFocusIndicator focusIndicator;
       private StylusHapticFeedback haptics;

       void Start()
       {
           input = FindObjectOfType<KeyboardStylusAlternative>();
           focusIndicator = GetComponent<ZSpaceFocusIndicator>();
           haptics = GetComponent<StylusHapticFeedback>();
       }

       void Update()
       {
           if (input.IsPrimaryButtonDown)
           {
               OnButtonClick();
           }
       }

       private void OnButtonClick()
       {
           haptics.TriggerClick();
           Debug.Log("Button clicked!");
       }
   }
   ```

7. **Create Prefab:**
   ```
   Drag "AccessibleButton3D" from Hierarchy to Project/Prefabs/Accessibility/
   ```

---

## Prefab 2: AccessibleZSpaceCanvas (UI)

**Purpose:** Screen-space UI canvas with accessibility support

**Setup in Unity:**

1. **Create UI Canvas:**
   ```
   Hierarchy → Right-click → UI → Canvas
   Rename: "AccessibleZSpaceCanvas"
   ```

2. **Configure Canvas:**
   ```
   Canvas Component:
   - Render Mode: Screen Space - Overlay
   - Pixel Perfect: true

   Canvas Scaler Component:
   - UI Scale Mode: Scale With Screen Size
   - Reference Resolution: 1920x1080
   - Match: 0.5 (balance width/height)
   ```

3. **Add Accessibility Manager:**
   ```
   Create empty child GameObject: "AccessibilityManager"
   Add Components:
   - KeyboardStylusAlternative
   - VoiceCommandManager
   - SubtitleSystem
   ```

4. **Add Sample Button:**
   ```
   Right-click Canvas → UI → Button
   Rename: "SampleAccessibleButton"

   Add Component: AccessibleStylusButton
   Configure:
   - Accessible Label: "Sample Button"
   - Keyboard Alternative: Space
   - Stylus Button Index: 0
   - Enable Haptic Feedback: true
   ```

5. **Validate Target Size:**
   ```
   Button RectTransform:
   - Width: 80 pixels (> 24px minimum ✓)
   - Height: 40 pixels (> 24px minimum ✓)
   ```

6. **Create Prefab:**
   ```
   Drag "AccessibleZSpaceCanvas" to Project/Prefabs/Accessibility/
   ```

---

## Prefab 3: AccessibleZSpaceMenu (3D Spatial Menu)

**Purpose:** 3D floating menu with keyboard navigation

**Setup in Unity:**

1. **Create Canvas (World Space):**
   ```
   Hierarchy → Right-click → UI → Canvas
   Rename: "AccessibleZSpaceMenu"

   Canvas Component:
   - Render Mode: World Space
   - Event Camera: [Assign Main Camera]

   RectTransform:
   - Width: 400
   - Height: 600
   - Scale: 0.002, 0.002, 0.002 (readable at 1m distance)
   ```

2. **Add Menu Script:**
   ```
   Add Component: AccessibleZSpaceMenu
   Configure:
   - Menu Name: "Main Menu"
   - Toggle Menu Key: M
   - Navigate Up Key: UpArrow
   - Navigate Down Key: DownArrow
   - Activate Key: Return
   - Close Key: Escape
   - Billboard To Camera: true
   ```

3. **Create Menu Panel:**
   ```
   Right-click Canvas → UI → Panel
   Rename: "MenuPanel"

   Image Component:
   - Color: #000000 (black), Alpha: 200 (semi-transparent)
   ```

4. **Add Menu Title:**
   ```
   Right-click MenuPanel → UI → Text (TextMeshPro)
   Rename: "MenuTitle"
   Text: "Settings"
   Font Size: 24
   Alignment: Center
   Color: #FFFFFF (white)
   ```

5. **Add Menu Buttons:**
   ```
   Create 4 buttons vertically:

   Button 1: "Audio Settings"
   - RectTransform: Width 360, Height 60
   - Add Component: AccessibleStylusButton

   Button 2: "Graphics Settings"
   - RectTransform: Width 360, Height 60
   - Add Component: AccessibleStylusButton

   Button 3: "Accessibility"
   - RectTransform: Width 360, Height 60
   - Add Component: AccessibleStylusButton

   Button 4: "About"
   - RectTransform: Width 360, Height 60
   - Add Component: AccessibleStylusButton
   ```

6. **Assign Buttons to Menu:**
   ```
   AccessibleZSpaceMenu Component:
   - Menu Buttons: [Drag all 4 buttons into array]
   ```

7. **Position in 3D Space:**
   ```
   Transform:
   - Position: (0, 1.5, 1) [1 meter in front of user at eye level]
   - Rotation: (0, 180, 0) [faces user]
   ```

8. **Create Prefab:**
   ```
   Drag "AccessibleZSpaceMenu" to Project/Prefabs/Accessibility/
   ```

---

## Prefab 4: DepthCueObject (Example)

**Purpose:** 3D object with all depth perception alternatives

**Setup in Unity:**

1. **Create GameObject:**
   ```
   3D Object → Sphere
   Rename: "DepthCueObject"
   ```

2. **Add All Depth Cue Components:**
   ```
   Add Components:
   - DepthCueManager
   - SpatialAudioManager
   - StylusHapticFeedback
   - ZSpaceFocusIndicator
   - AudioSource (for spatial audio)
   ```

3. **Configure DepthCueManager:**
   ```
   Enable Size Cue: true
   Enable Shadow Cue: true
   Enable Audio Cue: true
   Enable Haptic Cue: true
   Closest Distance: 0.5
   Farthest Distance: 5.0
   ```

4. **Configure SpatialAudioManager:**
   ```
   Audio Source: [Assign AudioSource component]
   Enable Spatial Audio: true
   Spatial Blend: 1.0
   Min Distance: 1.0
   Max Distance: 50.0
   Provide Mono Alternative: true
   ```

5. **Add Audio Clip:**
   ```
   AudioSource:
   - AudioClip: [Assign ambient sound]
   - Play On Awake: true
   - Loop: true
   ```

6. **Test Depth Cues:**
   ```
   Play Mode:
   - Move object closer/farther from camera
   - Verify: Size changes, audio volume changes
   - Remove glasses: Verify depth still perceivable
   ```

7. **Create Prefab:**
   ```
   Drag "DepthCueObject" to Project/Prefabs/Accessibility/
   ```

---

## Testing Prefabs

### Test Checklist:

**Keyboard Accessibility:**
- [ ] Tab through all interactive elements
- [ ] Spacebar activates buttons
- [ ] Arrow keys navigate menus
- [ ] Escape closes menus
- [ ] All actions work WITHOUT stylus

**Screen Reader (NVDA):**
- [ ] Launch NVDA (Ctrl+Alt+N)
- [ ] Tab through UI
- [ ] Verify elements announced with labels

**Depth Perception (Glasses Off):**
- [ ] Remove zSpace glasses
- [ ] View scene in 2D
- [ ] Verify depth perceivable via size, shadow, audio

**zSpace Hardware:**
- [ ] Stylus Button 0 works
- [ ] Haptic feedback triggers
- [ ] Focus indicators visible in 3D

---

## Prefab Documentation

Once created, document each prefab:

```markdown
# Prefab: AccessibleButton3D

**Location:** `Assets/Prefabs/Accessibility/AccessibleButton3D.prefab`

**Components:**
- Box Collider (for interaction)
- ZSpaceFocusIndicator (blue glow on focus)
- DepthCueManager (6 depth cues enabled)
- StylusHapticFeedback (click feedback)

**Usage:**
1. Drag prefab into scene
2. Position in 3D space
3. Add OnClick event in Inspector
4. Test with Tab + Spacebar

**WCAG Compliance:**
- ✓ WCAG 2.1.1: Keyboard accessible
- ✓ WCAG 2.4.7: Focus visible (blue glow)
- ✓ W3C XAUR: Depth alternatives (6 cues)
```

---

**Last Updated:** October 2025
**Platform:** Unity 2021.3+ with zSpace SDK
