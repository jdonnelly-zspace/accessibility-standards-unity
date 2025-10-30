# {{APP_NAME}} Accessibility Implementation Guide
## Making {{APP_NAME}} Work for All Students

**Last Updated:** {{AUDIT_DATE}}
**Audience:** Teachers, Administrators, IT Staff

---

## Important Context

Accommodation options depend on specific student needs, software version, and application module design. We recommend contacting **accessibility@zspace.com** for individualized consultation regarding specific student accommodation needs.

This guide provides general approaches and common scenarios to help you support students with disabilities using {{APP_NAME}}.

---

## Quick Setup Guide

### Student with Low Vision

**Scenario:** Student needs larger text and higher contrast to read content.

**Steps to Configure:**

1. **Adjust Text Size** (if available in application settings):
   - Open {{APP_NAME}} settings menu
   - Navigate to "Accessibility" or "Display" settings
   - Increase text scaling to 125-150%
   - Test readability with student

2. **Enable High Contrast Mode** (if available):
   - Look for "High Contrast" or "Visual Themes" in settings
   - Select a high-contrast theme
   - Try different themes to find what works best for the student

3. **Use Windows Magnifier** (built-in):
   - Press Windows key + "+" to open Magnifier
   - Adjust magnification level (100%-1600%)
   - Choose view mode: Full screen, Lens, or Docked
   - **Note:** Compatibility varies by module; some 3D content may not magnify well

4. **Adjust Display Settings** (zSpace hardware):
   - Reduce stereoscopic 3D intensity if causing visual strain
   - Consider turning off 3D mode for 2D viewing
   - Adjust brightness and contrast on zSpace display

**Note:** Specific settings vary by {{APP_NAME}} version and module. Contact us if needed features are not available: accessibility@zspace.com

---

### Student Who Cannot Use Stylus

**Scenario:** Student has limited hand mobility and cannot effectively use the zSpace stylus.

**Current Approaches:**

1. **Try Keyboard Alternatives** (availability varies):
   - Check application documentation for keyboard shortcuts
   - Enable "Keyboard Mode" if available in settings
   - Test navigation with Tab, Arrow keys, Enter, and Spacebar
   - **Note:** Full keyboard support is under development; coverage varies by module

2. **Adjust Stylus Sensitivity** (zSpace settings):
   - Open zSpace Core Software settings
   - Navigate to stylus calibration
   - Increase sensitivity for lighter touch
   - Test with student to find optimal settings

3. **Consider Alternative Input Devices**:
   - Mouse as alternative to stylus (partial support)
   - Adaptive mouse or trackball devices (may work with mouse mode)
   - Switch interface adapters (exploring compatibility)
   - **Contact us** for current status of alternative input support

**Contact accessibility@zspace.com if:**
- Keyboard alternatives are not working
- Student requires specific adaptive input device support
- You need help planning accommodations for motor impairments

---

### Student Using Screen Reader

**Scenario:** Student who is blind or has low vision uses NVDA, JAWS, or Windows Narrator.

**Current Status and Approaches:**

**⚠️ Screen Reader Support is Under Development**

**Current Limited Support:**
1. **Windows Narrator** (partial compatibility):
   - Enable Narrator: Windows key + Ctrl + Enter
   - Tab through UI elements (support varies by module)
   - Some buttons and labels may be announced
   - **Limitation:** 3D content and many interactive elements not yet accessible

2. **Audio Cues** (if available in application):
   - Enable audio feedback in settings
   - Listen for confirmation sounds when interacting
   - Use audio cues to navigate menu structure

3. **Keyboard Navigation** (if available):
   - Navigate without requiring visual feedback
   - Use keyboard shortcuts for common actions
   - Focus indicators may be limited

**Planned Enhancements:**
- Unity Accessibility Framework integration (in progress)
- Improved semantic labeling for all UI elements
- Audio descriptions for 3D content and visualizations
- Enhanced NVDA and JAWS compatibility

**Interim Workarounds:**
- Partner student with sighted peer for visual elements
- Provide alternative text descriptions of 3D content
- Use audio-described versions of lessons if available
- Contact us for current workaround options: accessibility@zspace.com

---

### Student with Hearing Impairment

**Scenario:** Student who is deaf or hard of hearing needs audio content alternatives.

**Steps to Configure:**

1. **Enable Captions** (if available):
   - Open {{APP_NAME}} settings
   - Navigate to "Audio" or "Accessibility" settings
   - Enable "Closed Captions" or "Subtitles"
   - Adjust caption size and appearance if options available

2. **Visual Indicators** (check availability):
   - Enable visual alerts for audio cues
   - Look for "Visual Notifications" in settings
   - Enable flash alerts for important events

3. **Transcripts** (if provided):
   - Check documentation for audio transcripts
   - Request transcripts from content creators
   - Contact accessibility@zspace.com if transcripts needed

**Note:** Audio content accessibility varies by module and content source. Contact us if captions or transcripts are not available for required content.

---

## Troubleshooting Common Issues

### "High Contrast Mode Makes Some Elements Invisible"

**Try:**
- ✅ Switch to a different high contrast theme
- ✅ Adjust individual color settings if available
- ✅ Use Windows High Contrast themes in addition to application settings
- ✅ Report the issue to accessibility@zspace.com with screenshots

---

### "Keyboard Navigation Skips Over Important Buttons"

**Try:**
- ✅ Try Tab and Shift+Tab to navigate in both directions
- ✅ Use arrow keys within menus and lists
- ✅ Check if application has alternative keyboard shortcut
- ✅ Enable "Full Keyboard Access" mode if available in settings

**Contact accessibility@zspace.com if:**
- Critical functionality cannot be reached with keyboard
- Focus order is illogical or confusing
- Focus indicators are not visible

---

### "Windows Magnifier Doesn't Work Well with 3D Content"

**Try:**
- ✅ Use application's built-in zoom features instead (if available)
- ✅ Switch zSpace to 2D mode to improve magnification compatibility
- ✅ Adjust zSpace display resolution for larger base text
- ✅ Use Magnifier in "Lens" or "Docked" mode instead of "Full screen"

**Alternative:**
- Increase overall UI scaling in Windows display settings
- Sit closer to zSpace display
- Use larger display if available

---

### "Screen Reader Announces Wrong Information or Stays Silent"

**Try:**
- ✅ Restart the screen reader after launching {{APP_NAME}}
- ✅ Try Windows Narrator instead of NVDA/JAWS (better Unity support currently)
- ✅ Use keyboard navigation to ensure focus is on intended element
- ✅ Check if "Accessibility Mode" setting exists in application

**Note:**
- Screen reader support is actively being enhanced
- Current compatibility is limited; full support in development
- Contact accessibility@zspace.com for workaround strategies

---

## When to Contact zSpace Accessibility Team

**Contact accessibility@zspace.com when:**

- ❗ Student has accessibility needs not covered in this guide
- ❗ Current accessibility options aren't working effectively
- ❗ You need help planning accommodations for a specific student
- ❗ Settings mentioned in this guide are not present in your application version
- ❗ You've identified an accessibility barrier that blocks learning

**What to Include:**
1. Description of the accessibility barrier or need
2. {{APP_NAME}} version you're using
3. Specific student accommodation goal
4. Any assistive technology the student uses
5. What you've already tried

**Support Approach:**
We evaluate requests individually and work to identify feasible solutions within current technical capabilities. We may be able to provide:
- Configuration guidance
- Workaround strategies
- Timeline for planned enhancements
- Alternative approaches to learning goals

---

## Accessibility Settings Reference

### Common Settings Locations

**If Available in {{APP_NAME}}:**

**Settings → Accessibility:**
- Text sizing
- High contrast themes
- Audio descriptions (if available)
- Keyboard navigation mode
- Visual notifications
- Captions/subtitles

**Settings → Display:**
- Resolution adjustments
- Color schemes
- Brightness/contrast
- 3D intensity/mode

**Settings → Audio:**
- Volume controls
- Audio cues
- Captions
- Text-to-speech (if available)

**Settings → Controls:**
- Keyboard shortcuts
- Input device options
- Stylus sensitivity (may be in zSpace Core Software)

**Note:** Available settings vary significantly by {{APP_NAME}} version and module. Not all settings listed here may be present.

---

## Windows Accessibility Features

### Built-In Tools That May Help

**Windows Magnifier:**
- Windows key + "+" to zoom in
- Windows key + "-" to zoom out
- Compatible with many {{APP_NAME}} UI elements

**Windows Narrator:**
- Windows key + Ctrl + Enter to toggle
- Partial compatibility with {{APP_NAME}} (improving)

**Windows High Contrast:**
- Left Alt + Left Shift + Print Screen
- Affects Windows UI and some application elements

**Ease of Access Center:**
- Windows key, type "Ease of Access"
- Configure keyboard, mouse, visual, and audio accessibility settings

---

## Additional Resources

### Internal Documentation

For Teachers:
- Application user manual (check for "Accessibility" section)
- Keyboard shortcut reference card (if available)
- Contact your {{APP_NAME}} administrator or IT support

For IT Staff:
- Full technical VPAT: VPAT-{{APP_NAME}}.md
- Implementation recommendations for developers (if customizing)
- Framework documentation: https://github.com/jdonnelly-zspace/accessibility-standards-unity

### External Resources

**General Accessibility:**
- WebAIM: https://webaim.org/
- Microsoft Accessibility: https://www.microsoft.com/accessibility/

**Assistive Technology:**
- NVDA Screen Reader: https://www.nvaccess.org/
- Windows Accessibility Features: https://support.microsoft.com/en-us/windows/windows-accessibility-features

**zSpace Resources:**
- zSpace Support: https://support.zspace.com/
- zSpace Developer: https://developer.zspace.com/

---

## Important Disclaimer

**Accommodation Variability:** Accommodation feasibility varies by student needs, {{APP_NAME}} version, application module design, and current technical capabilities. Features described may not be available in all versions or modules. This guide reflects general approaches and common scenarios but cannot guarantee specific solutions.

**Individual Consultation Recommended:** For specific student accommodation needs, contact **accessibility@zspace.com** for individualized consultation and support.

**Ongoing Development:** Many accessibility features are under active development. Settings and capabilities described in this guide may change as enhancements are implemented. Always check current application documentation and settings.

**Not Medical or Legal Advice:** This guide provides technical implementation guidance but is not medical or legal advice regarding disability accommodations or IEP/504 Plan requirements. Consult with appropriate school personnel and legal counsel regarding accommodation obligations.

---

**Last Updated:** {{AUDIT_DATE}}
**Contact:** accessibility@zspace.com
**Technical Documentation:** https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

*This guide is part of the {{APP_NAME}} accessibility documentation suite.*
