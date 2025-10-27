# Architecture Overview - Accessibility Standards Unity Framework v3.1.0

This document provides a comprehensive architectural overview of the accessibility-standards-unity framework, including system components, data flow, and integration points.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [CLI Tools Architecture](#cli-tools-architecture)
- [Unity Framework Architecture](#unity-framework-architecture)
- [Standards Engine](#standards-engine)
- [Code Generation Pipeline](#code-generation-pipeline)
- [CI/CD Integration](#cicd-integration)
- [Technology Stack](#technology-stack)

---

## High-Level Architecture

The framework consists of three primary subsystems:

```mermaid
graph TB
    subgraph User Entry Points
        A[CLI: a11y-audit-zspace]
        B[Unity Editor Tools]
        C[CI/CD Workflows]
    end

    subgraph Core Framework
        D[Audit Engine]
        E[Standards Compliance]
        F[Code Generator]
        G[Visual Analyzer]
    end

    subgraph Outputs
        H[VPAT Reports]
        I[Generated C# Code]
        J[Visual Analysis]
        K[GitHub Pages]
    end

    A --> D
    B --> D
    C --> D

    D --> E
    D --> G
    E --> F

    D --> H
    F --> I
    G --> J
    D --> K

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#fff4e1
    style F fill:#fff4e1
    style G fill:#fff4e1
    style H fill:#e8f5e9
    style I fill:#e8f5e9
    style J fill:#e8f5e9
    style K fill:#e8f5e9
```

---

## System Components

### 1. CLI Tools (`bin/`)

Command-line tools for automated accessibility auditing:

```mermaid
graph LR
    A[bin/audit.js] --> B[analyze-unity-project.js]
    A --> C[capture-screenshots.js]
    A --> D[analyze-visual-accessibility.js]
    A --> E[generate-fixes.js]
    A --> F[compare-audits.js]

    B --> G[Pattern Detectors]
    C --> H[Unity Batch Mode]
    D --> I[Image Analysis]
    E --> J[Code Generator]
    F --> K[Compliance Tracker]

    style A fill:#4285f4,color:#fff
    style B fill:#34a853
    style C fill:#34a853
    style D fill:#34a853
    style E fill:#34a853
    style F fill:#34a853
```

**Key Components:**
- **audit.js**: Main entry point, orchestrates all analysis
- **analyze-unity-project.js**: Scans Unity scenes and scripts
- **capture-screenshots.js**: Unity batch mode screenshot capture
- **analyze-visual-accessibility.js**: Contrast and color-blind analysis
- **generate-fixes.js**: Automated code generation
- **compare-audits.js**: Compliance tracking over time

### 2. Unity Framework (`implementation/unity/`)

Unity C# components and prefabs:

```mermaid
graph TB
    subgraph Unity Components
        A[Accessibility Scripts]
        B[Editor Tools]
        C[Prefabs]
        D[Tests]
    end

    subgraph Scripts
        A --> E[AccessibleStylusButton.cs]
        A --> F[KeyboardNavigationManager.cs]
        A --> G[UnityAccessibilityIntegration.cs]
        A --> H[DepthPerceptionAlternatives.cs]
    end

    subgraph Editor
        B --> I[AccessibilityAuditorWindow.cs]
        B --> J[AccessibilityValidator.cs]
    end

    subgraph Prefabs
        C --> K[AccessibleButton.prefab]
        C --> L[FocusIndicator.prefab]
        C --> M[ScreenReaderAnnouncer.prefab]
    end

    subgraph Tests
        D --> N[PlayMode Tests]
        D --> O[EditMode Tests]
    end

    style A fill:#ff6d00
    style B fill:#ffa000
    style C fill:#ff6d00
    style D fill:#ffa000
```

### 3. Standards Engine (`standards/`)

Compliance validation against accessibility standards:

```mermaid
graph TB
    A[Standards Engine] --> B[WCAG 2.2 Level AA]
    A --> C[W3C XAUR]
    A --> D[zSpace Checklist]
    A --> E[Section 508]

    B --> F[50 Success Criteria]
    C --> G[XR-Specific Requirements]
    D --> H[Stereoscopic Guidelines]
    E --> I[Federal Compliance]

    F --> J[Conformance Checker]
    G --> J
    H --> J
    I --> J

    J --> K[VPAT 2.5 Report]

    style A fill:#9c27b0,color:#fff
    style B fill:#ba68c8
    style C fill:#ba68c8
    style D fill:#ba68c8
    style E fill:#ba68c8
    style K fill:#4caf50,color:#fff
```

---

## Data Flow

### Complete Audit Workflow

```mermaid
flowchart TD
    Start([User runs: a11y-audit-zspace]) --> A[Analyze Unity Project]

    A --> B{Screenshots Enabled?}
    B -->|Yes| C[Launch Unity Batch Mode]
    B -->|No| D[Skip Screenshots]

    C --> E[Capture All Scenes]
    E --> F[Visual Analysis]
    F --> G[Contrast Checking]
    F --> H[Color-Blind Simulation]

    D --> I[Pattern Detection]
    G --> I
    H --> I

    I --> J[Detect Accessibility Issues]
    J --> K[Standards Compliance Check]

    K --> L{Generate Fixes?}
    L -->|Yes| M[Code Generator]
    L -->|No| N[Skip Generation]

    M --> O[Generate C# Code]
    O --> P[Report Generation]
    N --> P

    P --> Q[VPAT 2.5]
    P --> R[Audit Summary]
    P --> S[Recommendations]

    Q --> T{Export Options}
    R --> T
    S --> T

    T -->|PDF| U[Generate PDF]
    T -->|CSV| V[Generate CSV]
    T -->|GitHub Pages| W[Generate Dashboard]

    U --> X([Complete])
    V --> X
    W --> X

    style Start fill:#4285f4,color:#fff
    style X fill:#34a853,color:#fff
    style M fill:#fbbc04
    style K fill:#ea4335,color:#fff
```

### Screenshot Capture Flow

```mermaid
sequenceDiagram
    participant CLI as CLI Tool
    participant Unity as Unity Batch Mode
    participant FS as File System
    participant Analyzer as Visual Analyzer

    CLI->>Unity: Execute with -batchmode -executeMethod
    Unity->>Unity: Load Scene 1
    Unity->>FS: Save screenshot (1920x1080)
    Unity->>FS: Save thumbnail (320x180)
    Unity->>Unity: Load Scene 2
    Unity->>FS: Save screenshot
    Unity->>FS: Save thumbnail
    Unity-->>CLI: Exit code 0

    CLI->>Analyzer: Process screenshots
    Analyzer->>FS: Read all screenshots
    Analyzer->>Analyzer: Extract dominant colors
    Analyzer->>Analyzer: Calculate contrasts
    Analyzer->>Analyzer: Generate color-blind variants
    Analyzer->>FS: Save analysis results
    Analyzer-->>CLI: Analysis complete

    CLI->>CLI: Generate heatmaps
    CLI->>FS: Save heatmaps
```

---

## CLI Tools Architecture

### Pattern Detection System

```mermaid
graph TB
    A[Pattern Detectors] --> B[Keyboard Navigation Detector]
    A --> C[Focus Management Detector]
    A --> D[Screen Reader Detector]
    A --> E[Color Contrast Detector]
    A --> F[Audio Description Detector]

    B --> G[Analyze Input System]
    C --> G
    D --> G
    E --> H[Analyze UI Components]
    F --> I[Analyze Media Assets]

    G --> J{Issues Found?}
    H --> J
    I --> J

    J -->|Yes| K[Generate Recommendations]
    J -->|No| L[Mark as Compliant]

    K --> M[Code Templates]
    L --> N[Audit Report]

    M --> O[Code Generator]

    style A fill:#ff9800
    style O fill:#4caf50,color:#fff
```

### Code Generation Pipeline

```mermaid
graph LR
    A[Detected Issue] --> B{Issue Type}

    B -->|Keyboard| C[keyboard-scaffolding.js]
    B -->|Focus| D[focus-management.js]
    B -->|Screen Reader| E[accessibility-api-integration.js]

    C --> F[Load Template]
    D --> F
    E --> F

    F --> G[Inject Project Context]
    G --> H[Generate C# Code]

    H --> I[KeyboardNavigationManager.cs]
    H --> J[FocusIndicator.cs]
    H --> K[AccessibleButton.cs]

    I --> L[generated-fixes/]
    J --> L
    K --> L

    style A fill:#f44336,color:#fff
    style L fill:#4caf50,color:#fff
```

---

## Unity Framework Architecture

### Accessibility Component Hierarchy

```mermaid
classDiagram
    MonoBehaviour <|-- AccessibilityComponentBase
    AccessibilityComponentBase <|-- AccessibleStylusButton
    AccessibilityComponentBase <|-- KeyboardNavigationManager
    AccessibilityComponentBase <|-- DepthPerceptionAlternatives
    AccessibilityComponentBase <|-- ScreenReaderAnnouncer

    class AccessibilityComponentBase {
        +string AccessibilityLabel
        +string AccessibilityHint
        +bool IsAccessible
        +OnAccessibilityFocusChanged()
        +AnnounceToScreenReader(string)
    }

    class AccessibleStylusButton {
        +KeyCode KeyboardAlternative
        +OnStylusDown()
        +OnKeyboardActivate()
    }

    class KeyboardNavigationManager {
        +List~Selectable~ FocusableElements
        +int CurrentFocusIndex
        +FocusNext()
        +FocusPrevious()
    }

    class DepthPerceptionAlternatives {
        +AudioClip DepthCue
        +float SizeCueMultiplier
        +ProvideDepthFeedback()
    }

    class ScreenReaderAnnouncer {
        +AccessibilityNode Node
        +string AnnouncementText
        +Announce()
    }
```

### Unity Editor Integration

```mermaid
graph TB
    A[Unity Editor] --> B[Accessibility Menu]

    B --> C[Auditor Window]
    B --> D[Validator]
    B --> E[Component Wizard]

    C --> F[Run In-Editor Audit]
    F --> G[Scan Current Scene]
    G --> H[Display Results]

    D --> I[Validate Compliance]
    I --> J[Check Focus Indicators]
    I --> K[Check Keyboard Support]

    E --> L[Add Accessibility Components]
    L --> M[Configure Settings]

    style A fill:#000,color:#fff
    style C fill:#2196f3,color:#fff
    style D fill:#2196f3,color:#fff
    style E fill:#2196f3,color:#fff
```

---

## Standards Engine

### Compliance Validation Flow

```mermaid
flowchart TD
    A[Audit Data] --> B{WCAG 2.2 Check}

    B --> C[Perceivable]
    B --> D[Operable]
    B --> E[Understandable]
    B --> F[Robust]

    C --> G{1.1.1 Text Alternatives}
    C --> H{1.4.3 Contrast Minimum}

    D --> I{2.1.1 Keyboard}
    D --> J{2.4.7 Focus Visible}

    E --> K{3.2.1 On Focus}
    E --> L{3.3.2 Labels or Instructions}

    F --> M{4.1.2 Name, Role, Value}

    G --> N{Pass?}
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N

    N -->|Yes| O[Supports]
    N -->|Partial| P[Partially Supports]
    N -->|No| Q[Does Not Support]

    O --> R[VPAT Report]
    P --> R
    Q --> R

    style A fill:#9c27b0,color:#fff
    style R fill:#4caf50,color:#fff
```

---

## CI/CD Integration

### GitHub Actions Workflow

```mermaid
graph TB
    A[GitHub PR/Push] --> B[Trigger Workflow]

    B --> C[Setup Environment]
    C --> D[Install Node.js 18]
    C --> E[Install Unity via GameCI]

    D --> F[npm ci]
    E --> G[Activate Unity License]

    F --> H[Run Audit]
    G --> H

    H --> I[Capture Screenshots]
    I --> J[Analyze Accessibility]

    J --> K{Critical Issues?}

    K -->|Yes| L[Fail Build ❌]
    K -->|No| M{Regression?}

    M -->|Yes| N[Fail Build ❌]
    M -->|No| O[Pass Build ✅]

    J --> P[Upload Artifacts]
    J --> Q[Comment on PR]

    O --> R[Deploy to GitHub Pages]

    style A fill:#24292e,color:#fff
    style L fill:#d73a49,color:#fff
    style N fill:#d73a49,color:#fff
    style O fill:#28a745,color:#fff
    style R fill:#0366d6,color:#fff
```

### Multi-Platform Support

```mermaid
graph LR
    A[Framework] --> B[GitHub Actions]
    A --> C[GitLab CI]
    A --> D[Jenkins]
    A --> E[Azure DevOps]

    B --> F[accessibility-audit.yml]
    C --> G[.gitlab-ci.yml]
    D --> H[Jenkinsfile]
    E --> I[azure-pipelines.yml]

    F --> J[Same CLI Tool]
    G --> J
    H --> J
    I --> J

    J --> K[bin/audit.js]

    style A fill:#ff9800
    style K fill:#4caf50,color:#fff
```

---

## Technology Stack

### Runtime Dependencies

```mermaid
graph TB
    A[Node.js 18 LTS] --> B[Core CLI]

    B --> C[sharp ^0.33.0]
    B --> D[puppeteer ^23.0.0]
    B --> E[marked ^15.0.0]
    B --> F[csv-writer ^1.6.0]
    B --> G[@octokit/rest ^21.0.0]
    B --> H[color-contrast-checker ^2.1.0]

    C --> I[Screenshot Analysis]
    D --> J[PDF Generation]
    E --> K[Markdown Rendering]
    F --> L[CSV Export]
    G --> M[GitHub API]
    H --> N[WCAG Contrast]

    style A fill:#026e00,color:#fff
    style B fill:#68a063
```

### Unity Dependencies

```mermaid
graph TB
    A[Unity 2021.3 LTS+] --> B[Core Framework]

    B --> C[Unity.Accessibility Module]
    B --> D[TextMeshPro]
    B --> E[Input System Package]
    B --> F[zSpace SDK]

    C --> G[Screen Reader Support]
    D --> H[Accessible Text]
    E --> I[Keyboard Navigation]
    F --> J[Stylus Integration]

    style A fill:#000,color:#fff
    style B fill:#222,color:#fff
```

---

## Repository Structure

```
accessibility-standards-unity/
│
├── bin/                           # CLI Tools (Node.js)
│   ├── audit.js                   # Main audit orchestrator
│   ├── analyze-unity-project.js   # Unity project analyzer
│   ├── capture-screenshots.js     # Screenshot capture
│   ├── analyze-visual-accessibility.js  # Visual analysis
│   ├── generate-fixes.js          # Code generation entry
│   ├── compare-audits.js          # Compliance tracking
│   ├── pattern-detectors/         # Issue detection
│   └── code-generator/            # Code generation templates
│
├── implementation/unity/          # Unity Framework (C#)
│   ├── scripts/                   # Accessibility components
│   ├── prefabs/                   # Reusable UI prefabs
│   ├── editor/                    # Unity Editor tools
│   └── tests/                     # Unity Test Framework
│
├── standards/                     # Compliance Standards
│   ├── WCAG-2.2-LEVEL-AA.md       # WCAG 2.2 criteria
│   ├── XR-ACCESSIBILITY-REQUIREMENTS.md  # W3C XAUR
│   └── ZSPACE-ACCESSIBILITY-CHECKLIST.md # zSpace guidelines
│
├── templates/                     # Report & Code Templates
│   ├── audit/                     # VPAT, summary templates
│   └── code/                      # C# code templates
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # This file
│   ├── CI-CD-INTEGRATION.md       # CI/CD guide
│   └── planning/                  # Internal planning
│
├── .github/workflows/             # GitHub Actions
│   ├── accessibility-audit.yml    # PR audit workflow
│   └── publish-reports.yml        # GitHub Pages deployment
│
└── workflows/                     # User Workflows
    ├── DEVELOPER-WORKFLOW.md      # For Unity developers
    ├── DESIGNER-WORKFLOW.md       # For UI/UX designers
    ├── QA-WORKFLOW.md             # For QA engineers
    └── PRODUCT-OWNER-WORKFLOW.md  # For product owners
```

---

## Design Principles

### 1. **Separation of Concerns**
- CLI tools (Node.js) separate from Unity framework (C#)
- Standards definitions separate from validation logic
- Allows independent updates and testing

### 2. **Extensibility**
- Plugin-based pattern detection system
- Template-based code generation
- Modular standards compliance checkers

### 3. **Automation First**
- Automated auditing reduces manual effort from 79.3% → 20%
- CI/CD integration catches regressions early
- Code generation provides working solutions

### 4. **Platform Agnostic**
- Supports 4 major CI/CD platforms
- Works with Unity 2021.3 LTS through 2023.2+
- Cross-platform Node.js CLI tools

### 5. **Standards Compliant**
- WCAG 2.2 Level AA (50 criteria)
- W3C XAUR for XR accessibility
- Section 508 federal compliance
- VPAT 2.5 professional reporting

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Basic Audit** | < 1 second | No screenshots, pattern detection only |
| **Full Audit** | 5-15 minutes | Screenshots + visual analysis + code gen |
| **Screenshot Capture** | ~10 sec/scene | Unity batch mode per scene |
| **Visual Analysis** | ~3 sec/scene | Contrast + color-blind simulation |
| **Code Generation** | < 5 seconds | All detected issues |
| **PDF Export** | ~10 seconds | Puppeteer rendering |
| **CI/CD Overhead** | ~2 minutes | Unity activation + npm install |

---

## Future Architecture Considerations

### Planned Enhancements

1. **Machine Learning Integration**
   - AI-powered pattern detection
   - Predictive compliance scoring
   - Automated fix suggestions

2. **Real-Time Monitoring**
   - Live accessibility checks in Unity Editor
   - Real-time VPAT updates
   - Continuous compliance dashboard

3. **Cloud Processing**
   - Offload screenshot capture to cloud
   - Distributed visual analysis
   - Centralized compliance tracking

4. **Plugin Ecosystem**
   - Third-party pattern detectors
   - Custom code generators
   - Industry-specific standards

---

## References

- **WCAG 2.2**: https://www.w3.org/TR/WCAG22/
- **W3C XAUR**: https://www.w3.org/TR/xaur/
- **Unity Accessibility**: https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- **VPAT 2.5**: https://www.itic.org/policy/accessibility/vpat

---

**Document Version**: 1.0
**Last Updated**: October 27, 2025
**Framework Version**: 3.1.0
**Maintained By**: @jdonnelly-zspace
