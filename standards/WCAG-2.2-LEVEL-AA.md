# WCAG 2.2 Level AA Compliance Checklist

**Target:** WCAG 2.2 Level AA (includes all Level A criteria)
**Last Updated:** October 2025
**Based on:** W3C Web Content Accessibility Guidelines 2.2

---

## Overview

Level AA is the **recommended minimum standard** for web accessibility. It satisfies:
- ✅ US Section 508 requirements
- ✅ EU EN 301 549 requirements
- ✅ ADA Title III (web accessibility)
- ✅ Most international accessibility laws

---

## Implementation Checklist

Use this checklist to verify compliance. Each criterion includes:
- **Success Criterion** number and name
- **Level** (A or AA)
- **What it means** in plain language
- **How to test** it
- **Common issues** to avoid

---

## Principle 1: Perceivable

### 1.1 Text Alternatives

#### ✅ 1.1.1 Non-text Content (Level A)

**Requirement:** All images, icons, and non-text content must have text alternatives.

**Implementation:**
```html
<!-- Images -->
<img src="photo.jpg" alt="Team celebrating product launch" />

<!-- Decorative images -->
<img src="decoration.svg" alt="" />

<!-- Icon buttons -->
<button aria-label="Close menu">
  <i class="fa fa-times"></i>
</button>
```

**Testing:**
- [ ] All `<img>` tags have `alt` attributes
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] Icon-only buttons have `aria-label`
- [ ] FontAwesome icons are properly labeled

**Tools:**
- axe DevTools
- WAVE browser extension
- ESLint `jsx-a11y/alt-text` rule

---

### 1.2 Time-based Media

#### ✅ 1.2.1 Audio-only and Video-only (Prerecorded) (Level A)

**Requirement:** For prerecorded audio-only and video-only media, provide an alternative (transcript or audio description).

**Implementation:**
```jsx
// Prerecorded audio-only (podcast, audio announcement)
function AudioContent() {
  return (
    <div>
      <h2>Company Announcement</h2>
      <audio controls src="/announcement.mp3">
        Your browser does not support the audio element.
      </audio>

      {/* Alternative: Text transcript */}
      <details>
        <summary>Read transcript</summary>
        <div>
          <h3>Transcript</h3>
          <p>
            Welcome to our Q4 company announcement. Today we're excited to share
            three major updates with our team...
          </p>
          <p>
            First, we're expanding our product line to include...
          </p>
        </div>
      </details>

      {/* Or link to separate transcript page */}
      <a href="/transcripts/announcement-2025-10.html">
        View full transcript
      </a>
    </div>
  );
}

// Prerecorded video-only (silent demonstration, animation)
function VideoOnlyContent() {
  return (
    <div>
      <h2>Product Assembly Instructions</h2>
      <video controls src="/assembly-demo.mp4" />

      {/* Alternative 1: Audio description track */}
      <video controls>
        <source src="/assembly-demo.mp4" type="video/mp4" />
        <track
          kind="descriptions"
          src="/assembly-demo-audio-description.vtt"
          label="Audio descriptions"
        />
      </video>

      {/* Alternative 2: Text transcript describing what's shown */}
      <details>
        <summary>Read description</summary>
        <div>
          <h3>Visual Description</h3>
          <ol>
            <li>Remove parts from packaging and lay them on a flat surface</li>
            <li>Identify piece A (the base) and piece B (the frame)</li>
            <li>Insert frame into base by aligning the notches...</li>
          </ol>
        </div>
      </details>
    </div>
  );
}

// Podcast with transcript
function PodcastEpisode({ episode }) {
  return (
    <article>
      <h2>{episode.title}</h2>
      <p>{episode.description}</p>

      <audio controls src={episode.audioUrl}>
        Your browser does not support the audio element.
      </audio>

      {/* Transcript */}
      <section aria-labelledby="transcript-heading">
        <h3 id="transcript-heading">Transcript</h3>
        <div dangerouslySetInnerHTML={{ __html: episode.transcript }} />
      </section>
    </article>
  );
}
```

**Testing:**
- [ ] All prerecorded audio-only content has text transcript
- [ ] All prerecorded video-only (no audio) has audio description or transcript
- [ ] Transcripts are accurate and complete
- [ ] Transcripts identify speakers
- [ ] Transcripts include relevant non-speech sounds
- [ ] Alternative is easy to find (linked or on same page)

**Common Content Types:**
- **Audio-only:** Podcasts, audio announcements, audio messages, music
- **Video-only:** Silent demonstrations, animations, visual-only instructions

**Exceptions:**
- Live audio/video (different requirement - see 1.2.4)
- Media that is itself an alternative (e.g., audio version of text)
- Test or exercise where audio/video must be audio/video to be valid

**Tools:**
- Manual review
- Check for transcript links
- Verify transcript accuracy

---

#### ✅ 1.2.2 Captions (Prerecorded) (Level A)

**Requirement:** Captions are provided for all prerecorded audio content in synchronized media (video with audio).

**Why This Matters:**
Users who are deaf or hard of hearing need captions to access video content. Captions also benefit users in noisy environments or who prefer reading.

**Implementation:**
```html
<!-- HTML5 video with WebVTT captions -->
<video controls>
  <source src="/presentation.mp4" type="video/mp4" />

  <!-- Caption track -->
  <track
    kind="captions"
    src="/presentation-captions-en.vtt"
    srclang="en"
    label="English"
    default
  />

  <!-- Additional languages -->
  <track
    kind="captions"
    src="/presentation-captions-es.vtt"
    srclang="es"
    label="Español"
  />
</video>

<!-- YouTube embed (YouTube auto-generates captions but review for accuracy) -->
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID?cc_load_policy=1"
  title="Video title"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe>
```

**WebVTT Caption File Format:**
```vtt
WEBVTT

00:00:00.000 --> 00:00:03.500
Welcome to our accessibility training.

00:00:03.500 --> 00:00:07.000
Today we'll cover WCAG 2.2 Level AA compliance.

00:00:07.000 --> 00:00:11.200
[upbeat music playing]

00:00:11.200 --> 00:00:14.500
Let's start with keyboard navigation.
```

**React Implementation:**
```jsx
function VideoPlayer({ videoUrl, captionTracks }) {
  const videoRef = useRef(null);

  return (
    <div className="video-container">
      <video ref={videoRef} controls>
        <source src={videoUrl} type="video/mp4" />

        {captionTracks.map((track) => (
          <track
            key={track.language}
            kind="captions"
            src={track.url}
            srclang={track.language}
            label={track.label}
            default={track.isDefault}
          />
        ))}

        Your browser does not support the video tag.
      </video>
    </div>
  );
}

// Usage
<VideoPlayer
  videoUrl="/product-demo.mp4"
  captionTracks={[
    {
      language: 'en',
      url: '/captions/product-demo-en.vtt',
      label: 'English',
      isDefault: true
    },
    {
      language: 'es',
      url: '/captions/product-demo-es.vtt',
      label: 'Español',
      isDefault: false
    }
  ]}
/>
```

**Caption Best Practices:**
- Include all dialogue and narration
- Identify speakers when not obvious
- Describe relevant sound effects: [door slams], [phone ringing]
- Describe music when relevant: [upbeat jazz music]
- Include on-screen text if relevant
- Sync captions accurately with audio (±200ms ideal)
- Use proper punctuation and grammar
- Break lines at natural phrase boundaries
- Keep captions on screen long enough to read (1.5-2 seconds minimum)
- Position captions to not obscure important visual content

**Caption Format:**
```vtt
WEBVTT

00:00:00.000 --> 00:00:02.500
[Speaker 1] Welcome everyone.

00:00:02.500 --> 00:00:05.000
[Speaker 2] Thanks for having me.

00:00:05.000 --> 00:00:08.000
[upbeat music playing in background]

00:00:08.000 --> 00:00:11.000
Let's dive into today's topic.
```

**Testing:**
- [ ] All videos have caption tracks
- [ ] Captions can be enabled/disabled
- [ ] Captions are accurate and complete
- [ ] All dialogue is captioned
- [ ] Relevant sound effects are described
- [ ] Speaker identification when multiple speakers
- [ ] Captions are properly synchronized
- [ ] Captions are readable (contrast, size, position)
- [ ] Test caption controls are keyboard accessible

**Common Issues:**
- Auto-generated captions without review (often inaccurate)
- Missing sound effects or music descriptions
- Poor synchronization
- Captions obscuring important visuals
- No speaker identification

**Tools:**
- Manual review
- Caption validation tools
- YouTube caption editor
- Rev.com or similar caption services

**Exceptions:**
- Live video (see 1.2.4 Captions - Live)
- Video that is itself a media alternative for text

---

#### ✅ 1.2.3 Audio Description or Media Alternative (Prerecorded) (Level A)

**Requirement:** An alternative for time-based media (transcript) OR audio description of the video content is provided for prerecorded synchronized media.

**Why This Matters:**
Users who are blind or have low vision need descriptions of important visual content in videos. This can be provided as audio descriptions or as a full text transcript.

**Implementation:**

**Option 1: Full Text Transcript (Easiest)**
```jsx
// Comprehensive transcript includes both audio and visual information
function VideoWithTranscript() {
  return (
    <div>
      <video controls>
        <source src="/training-video.mp4" type="video/mp4" />
        <track kind="captions" src="/captions.vtt" srclang="en" />
      </video>

      <details open>
        <summary>Full Transcript with Visual Descriptions</summary>
        <div>
          <h3>Video Transcript</h3>

          <p><strong>[Scene: Office conference room]</strong></p>
          <p><strong>Sarah:</strong> Welcome to the accessibility training.</p>

          <p><strong>[Visual: Slide showing "WCAG 2.2 Level AA"]</strong></p>
          <p><strong>Sarah:</strong> Today we're covering WCAG 2.2 compliance.</p>

          <p><strong>[Visual: Sarah demonstrates keyboard navigation by pressing Tab key,
          highlighting each button on screen in sequence]</strong></p>
          <p><strong>Sarah:</strong> First, let's look at keyboard navigation.</p>

          <p><strong>[Visual: Screen shows focus indicators moving between buttons]</strong></p>
          <p><strong>Sarah:</strong> Notice how each element is clearly indicated
          with a blue outline.</p>
        </div>
      </details>
    </div>
  );
}
```

**Option 2: Separate Audio Description Track**
```jsx
function VideoWithAudioDescription() {
  return (
    <div>
      <video controls>
        <source src="/training-video.mp4" type="video/mp4" />

        {/* Captions */}
        <track kind="captions" src="/captions.vtt" srclang="en" label="English" />

        {/* Audio descriptions */}
        <track
          kind="descriptions"
          src="/audio-descriptions.vtt"
          srclang="en"
          label="Audio descriptions"
        />
      </video>

      <p>
        <button onClick={toggleAudioDescriptions}>
          Enable Audio Descriptions
        </button>
      </p>
    </div>
  );
}
```

**Audio Description VTT Format:**
```vtt
WEBVTT

00:00:05.000 --> 00:00:08.000
Sarah enters a modern conference room with a projector screen behind her.

00:00:15.000 --> 00:00:18.000
The slide shows "WCAG 2.2 Level AA" in large blue letters.

00:00:25.000 --> 00:00:29.000
Sarah's hand moves to the keyboard and presses the Tab key repeatedly.
Focus indicators highlight each button in sequence.
```

**Option 3: Alternative Audio-Described Version**
```jsx
function VideoWithAlternativeVersion() {
  const [version, setVersion] = useState('standard');

  return (
    <div>
      <div role="group" aria-label="Video version selection">
        <button
          onClick={() => setVersion('standard')}
          aria-pressed={version === 'standard'}
        >
          Standard Version
        </button>
        <button
          onClick={() => setVersion('described')}
          aria-pressed={version === 'described'}
        >
          Audio Described Version
        </button>
      </div>

      <video controls key={version}>
        <source
          src={version === 'standard'
            ? '/video.mp4'
            : '/video-audio-described.mp4'}
          type="video/mp4"
        />
        <track kind="captions" src="/captions.vtt" srclang="en" />
      </video>
    </div>
  );
}
```

**What to Describe:**
- Important visual actions (gestures, demonstrations)
- On-screen text that isn't spoken
- Scene changes and locations
- Facial expressions if relevant to content
- Visual charts, graphs, diagrams
- Visual humor or visual-only content
- Speaker identification if not obvious from audio

**What NOT to Describe:**
- Things that are obvious from audio
- Decorative elements
- Details not relevant to understanding

**Testing:**
- [ ] Video has full transcript with visual descriptions OR audio description track
- [ ] Transcript describes all important visual information
- [ ] Audio descriptions fit in natural pauses (don't overlap dialogue)
- [ ] Transcript is accurate and complete
- [ ] Alternative is easy to find
- [ ] Test with eyes closed - can you understand the content?

**Common Issues:**
- Transcript only includes dialogue (misses visual info)
- Audio descriptions overlap important dialogue
- Missing descriptions of key visual demonstrations
- Transcript doesn't describe on-screen text

**Best Choice:**
- **Transcript with visual descriptions** - Easiest to implement, benefits everyone
- **Audio description track** - Better for video-heavy content, requires more production

**Tools:**
- Manual review with screen reader
- Watch video with eyes closed to test audio descriptions
- YouDescribe (collaborative audio description)

**Exceptions:**
- Video is itself a media alternative for text (already has text version)
- Video has no important visual information beyond what's in audio

---

#### ✅ 1.2.4 Captions (Live) (Level AA) ⭐

**Requirement:** Captions are provided for all live audio content in synchronized media (live video with audio).

**Why This Matters:**
Users who are deaf or hard of hearing need real-time captions to access live content like webinars, live streams, video conferences, and live events.

**Implementation:**
```jsx
// Good: Live stream with real-time captions
function LiveStream() {
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  return (
    <div>
      <h2>Live Webinar</h2>

      {/* Live video player */}
      <video controls autoPlay>
        <source src="https://live-stream.example.com/feed" type="application/x-mpegURL" />

        {/* Live caption track */}
        <track
          kind="captions"
          src="https://live-stream.example.com/captions"
          srclang="en"
          label="English (Live)"
          default={captionsEnabled}
        />
      </video>

      {/* Caption controls */}
      <label>
        <input
          type="checkbox"
          checked={captionsEnabled}
          onChange={(e) => setCaptionsEnabled(e.target.checked)}
        />
        Show live captions
      </label>
    </div>
  );
}

// Good: Video conference with live transcription
function VideoConference() {
  const [liveTranscript, setLiveTranscript] = useState([]);

  return (
    <div>
      <div className="video-grid">
        {/* Participant videos */}
      </div>

      {/* Live transcript panel */}
      <aside aria-live="polite" aria-label="Live transcript">
        <h3>Live Transcript</h3>
        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            background: '#f3f4f6',
            padding: '1rem',
            fontFamily: 'monospace'
          }}
        >
          {liveTranscript.map((line, index) => (
            <p key={index}>
              <strong>{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
}

// Good: Live event with professional captioner
function LiveEvent() {
  return (
    <div>
      <iframe
        src="https://event-platform.example.com/stream"
        title="Live event stream with captions"
        width="100%"
        height="500"
      />

      <p>
        This event includes live captions provided by a professional stenographer.
        Captions appear on the video player.
      </p>
    </div>
  );
}

// Real-time caption services integration
function IntegratedLiveCaptions() {
  const [captionService, setCaptionService] = useState('google'); // google, aws, azure

  const initializeCaptions = async () => {
    switch (captionService) {
      case 'google':
        // Google Cloud Speech-to-Text API
        // Real-time transcription
        break;
      case 'aws':
        // AWS Transcribe Streaming
        break;
      case 'azure':
        // Azure Speech Service
        break;
    }
  };

  return (
    <div>
      <video id="live-video" controls autoPlay />

      {/* Caption display overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '18px'
        }}
        role="region"
        aria-live="polite"
        aria-label="Live captions"
      >
        {/* Real-time caption text appears here */}
      </div>
    </div>
  );
}
```

**Live Captioning Solutions:**

**1. Automated Speech Recognition (ASR):**
- Google Cloud Speech-to-Text
- AWS Transcribe
- Azure Speech Service
- Rev.ai Live Captions
- Accuracy: 80-95% (depends on audio quality, accents)

**2. Professional Stenographers/CART:**
- Communication Access Realtime Translation (CART)
- Human captioner types in real-time
- Accuracy: 98-99%
- Higher cost but better quality

**3. Platform-Specific Solutions:**
- YouTube Live automatic captions
- Zoom auto-transcription
- Microsoft Teams live captions
- Google Meet live captions

**Implementation Considerations:**
```javascript
// Quality factors for live captions
const captionQuality = {
  audioQuality: 'Clear audio with minimal background noise',
  speakerClarity: 'Clear speech, not too fast',
  vocabulary: 'Standard vocabulary (technical terms may need training)',
  delay: 'Acceptable delay: 2-5 seconds',
  accuracy: 'Target: 95%+ accuracy'
};

// Improve ASR accuracy
const improvements = {
  audioSetup: 'Use quality microphone, minimize background noise',
  speakerTraining: 'Ask speakers to speak clearly and at moderate pace',
  vocabularyTraining: 'Train ASR on domain-specific terms',
  humanReview: 'Consider hybrid: ASR + human correction for critical events',
  fallback: 'Provide transcript after event if live captions unavailable'
};
```

**Testing:**
- [ ] All live video content has real-time captions
- [ ] Captions are synchronized with audio (2-5 second delay acceptable)
- [ ] Captions can be enabled/disabled by users
- [ ] Caption accuracy is reasonable (aim for 95%+)
- [ ] Test with live webinar or video call
- [ ] Verify captions appear for all speakers
- [ ] Check caption readability (size, contrast, position)

**Common Live Content Requiring Captions:**
- Webinars and online courses
- Live video conferences
- Virtual events and concerts
- Live streaming (Twitch, YouTube Live)
- Town halls and company meetings
- Court proceedings (when streamed)
- Legislative sessions

**Acceptable Alternatives:**
- Provide full transcript immediately after live event
- Offer sign language interpreter visible in video
- Provide alternative real-time communication (live chat with written summary)

**Common Issues:**
- No captions for live webinars
- Auto-captions not enabled
- Caption delay too long (>10 seconds)
- Poor audio quality causing caption errors
- Captions not visible to all participants

**Best Practices:**
- Test caption setup before live event
- Have backup plan (post-event transcript)
- Inform attendees that captions are available
- Use quality audio equipment
- Train speakers on clear speech
- Consider professional captioner for important events

**Tools:**
- Zoom: Built-in auto-transcription or third-party CART integration
- Google Meet: Built-in live captions
- Microsoft Teams: Live captions feature
- OBS Studio: Caption plugin for streaming
- StreamText: Professional CART services
- Rev: Live captioning services

**Cost Considerations:**
- **Automated ASR:** $0-0.02 per minute (often free with platform)
- **Professional CART:** $150-250 per hour
- **Hybrid:** ASR + human correction

---

#### ✅ 1.2.5 Audio Description (Prerecorded) (Level AA) ⭐

**Requirement:** Audio description is provided for all prerecorded video content in synchronized media.

**Why This Matters:**
Level A allows either audio description OR a full transcript. Level AA requires actual audio description (narration of visual content) for prerecorded videos with important visual information.

**Difference from 1.2.3:**
- **1.2.3 (Level A):** Audio description OR transcript (either is acceptable)
- **1.2.5 (Level AA):** Audio description required (transcript alone is not sufficient)

**Implementation:**
```jsx
// Good: Video with audio description track
function VideoWithAudioDescription() {
  const [audioDescEnabled, setAudioDescEnabled] = useState(false);

  return (
    <div>
      <h2>Training Video</h2>

      <video controls id="training-video">
        <source src="/training.mp4" type="video/mp4" />

        {/* Standard captions */}
        <track
          kind="captions"
          src="/training-captions.vtt"
          srclang="en"
          label="English"
          default
        />

        {/* Audio description track */}
        <track
          kind="descriptions"
          src="/training-audio-desc.vtt"
          srclang="en"
          label="Audio descriptions"
        />
      </video>

      <label>
        <input
          type="checkbox"
          checked={audioDescEnabled}
          onChange={(e) => {
            setAudioDescEnabled(e.target.checked);
            const video = document.getElementById('training-video');
            const descTrack = video.textTracks[1]; // Audio description track
            descTrack.mode = e.target.checked ? 'showing' : 'hidden';
          }}
        />
        Enable audio descriptions
      </label>

      <p>
        <small>
          Audio descriptions provide narration of important visual content
          during natural pauses in dialogue.
        </small>
      </p>
    </div>
  );
}

// Good: Separate audio-described version
function VideoWithADVersion() {
  const [version, setVersion] = useState('standard');

  return (
    <div>
      <h2>Product Demo</h2>

      <div role="group" aria-label="Video version selection">
        <button
          onClick={() => setVersion('standard')}
          aria-pressed={version === 'standard'}
          style={{
            fontWeight: version === 'standard' ? 'bold' : 'normal',
            background: version === 'standard' ? '#e5e7eb' : 'transparent'
          }}
        >
          Standard Version
        </button>
        <button
          onClick={() => setVersion('audio-described')}
          aria-pressed={version === 'audio-described'}
          style={{
            fontWeight: version === 'audio-described' ? 'bold' : 'normal',
            background: version === 'audio-described' ? '#e5e7eb' : 'transparent'
          }}
        >
          Audio Described Version
        </button>
      </div>

      <video controls key={version}>
        <source
          src={
            version === 'standard'
              ? '/product-demo.mp4'
              : '/product-demo-audio-described.mp4'
          }
          type="video/mp4"
        />
        <track kind="captions" src="/captions.vtt" srclang="en" />
      </video>

      {version === 'audio-described' && (
        <p aria-live="polite">
          This version includes narration of on-screen actions during pauses
          in the dialogue.
        </p>
      )}
    </div>
  );
}

// Audio description VTT file example
const audioDescriptionExample = `
WEBVTT

NOTE
Audio descriptions for training video
Descriptions fit in natural pauses in dialogue

00:00:05.000 --> 00:00:08.500
The instructor opens a laptop and navigates to the dashboard.

00:00:15.000 --> 00:00:19.000
The screen shows a bar chart with sales data increasing from left to right.

00:00:28.000 --> 00:00:32.000
The instructor clicks on the settings icon, revealing a dropdown menu with five options.

00:00:42.000 --> 00:00:46.500
A split-screen view shows before and after comparisons of the interface redesign.
`;
```

**Audio Description Best Practices:**

**What to Describe:**
- Important visual actions and demonstrations
- On-screen text that isn't spoken
- Scene changes and locations
- Facial expressions conveying emotion
- Charts, graphs, diagrams, and data visualizations
- Visual humor or sight gags
- Gestures and body language
- Important props or objects
- Visual-only information

**What NOT to Describe:**
- Things already clear from dialogue
- Decorative elements
- Obvious actions (person walking, if already mentioned)
- Every detail (only important visual information)

**Timing Considerations:**
```javascript
// Audio description timing rules
const timingRules = {
  placement: 'Fit descriptions in natural pauses between dialogue',
  length: 'Keep descriptions concise (2-5 seconds typically)',
  priority: 'Describe most important visual info first',
  voicing: 'Use neutral, objective tone',
  spoilers: 'Avoid revealing plot points before dialogue does'
};
```

**Production Methods:**

**1. Extended Audio Description:**
- Pause video when needed for longer descriptions
- Resume when description complete
- Use when natural pauses insufficient

**2. Standard Audio Description:**
- Fit descriptions in existing pauses
- Most common approach
- No video modification needed

**Example Script:**
```
[00:15-00:18] Sarah enters a modern office space with floor-to-ceiling windows.
[00:32-00:35] The pie chart shows 60% blue, 30% green, 10% red.
[00:58-01:02] The app interface displays a clean design with three main tabs at the top.
[01:45-01:49] Tom nods in agreement, a slight smile on his face.
```

**Testing:**
- [ ] All prerecorded videos have audio description
- [ ] Audio descriptions don't overlap important dialogue
- [ ] Descriptions cover all important visual information
- [ ] Test by listening with eyes closed
- [ ] Verify user can enable/disable audio description
- [ ] Check that described version is easy to find
- [ ] Descriptions are clear and concise
- [ ] Voice quality is good (clear, neutral tone)

**When Audio Description is NOT Required:**
- Video is audio-only (no visual component)
- All visual information is already in audio track
- Video is decorative/ambient only
- Alternative accessible version provided (detailed transcript)

**Common Violations:**
- Training videos with on-screen demonstrations not described
- Charts/graphs shown without verbal description
- Silent visual instructions
- Visual-only humor or context

**Production Resources:**
- Audio Description Coalition: https://audiodescriptioncoalition.org/
- Described and Captioned Media Program: https://dcmp.org/
- Professional audio description services (Rev, 3Play Media)
- DIY: Record descriptions, mix with video audio

**Cost Considerations:**
- **Professional AD:** $200-500 per finished minute
- **DIY:** Free but time-intensive
- **Software:** Audacity (free), Adobe Audition

**Exceptions:**
- Video has no important visual information (talking head only)
- All visual content is described in dialogue naturally
- Video is a pure demonstration where visual is the content (e.g., art exhibition)

---

### 1.3 Adaptable

#### ✅ 1.3.1 Info and Relationships (Level A)

**Requirement:** Structure and relationships must be programmatically determined.

**Implementation:**
```html
<!-- Use semantic HTML -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
  </article>
</main>
<footer>...</footer>
```

**Testing:**
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Only one H1 per page
- [ ] Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Form labels associated with inputs
- [ ] Tables use `<th>` for headers

**Tools:**
- Browser DevTools (inspect semantic structure)
- HeadingsMap browser extension
- axe DevTools

---

#### ✅ 1.3.2 Meaningful Sequence (Level A)

**Requirement:** Content order must be meaningful when presented sequentially.

**Implementation:**
- Use logical source order in HTML
- Tab order matches visual order
- CSS doesn't create confusing visual order

**Testing:**
- [ ] Tab through page - order makes sense
- [ ] Turn off CSS - content still makes sense
- [ ] Screen reader announces content in logical order

**Tools:**
- Keyboard navigation (Tab key)
- Screen reader testing

---

#### ✅ 1.3.3 Sensory Characteristics (Level A)

**Requirement:** Instructions don't rely solely on sensory characteristics like shape, size, visual location, orientation, or sound.

**Implementation:**
```jsx
// Bad: Shape/location only
<p>Click the round button on the right to continue</p>

// Good: Descriptive text
<p>Click the "Continue" button to proceed to checkout</p>

// Bad: Color only
<p>Required fields are shown in red</p>

// Good: Multiple indicators
<p>Required fields are marked with an asterisk (*) and the label "Required"</p>

// Bad: Sound only
<p>You'll hear a beep when the upload completes</p>

// Good: Multiple indicators
<p>You'll hear a beep and see a "Complete" message when the upload finishes</p>
```

**Testing:**
- [ ] Instructions don't reference only shape ("round button", "square icon")
- [ ] Instructions don't reference only location ("button on right", "top menu")
- [ ] Instructions don't reference only size ("large button", "small text")
- [ ] Instructions don't rely only on color ("red button", "green checkmark")
- [ ] Audio cues have visual equivalents
- [ ] Visual cues don't rely only on color

**Common Issues:**
- "Click the round button" (no accessible name given)
- "Fill in the fields marked in red" (color-only indication)
- "The menu is on the left side" (position-only)
- "You'll hear a sound when done" (audio-only feedback)

---

#### ✅ 1.3.4 Orientation (Level AA) ⭐

**Requirement:** Content does not restrict its view and operation to a single display orientation (portrait or landscape), unless a specific orientation is essential.

**Why This Matters:**
Users with devices mounted to wheelchairs or desks cannot easily rotate their screens. Some users need landscape for text magnification, others prefer portrait.

**Implementation:**
```css
/* Bad: Force landscape orientation */
@media screen and (orientation: portrait) {
  body::before {
    content: "Please rotate your device to landscape mode";
    /* Forces user to rotate - FAILS */
  }
  main {
    display: none; /* Hides content in portrait - FAILS */
  }
}

/* Good: Support both orientations */
@media screen and (orientation: portrait) {
  .container {
    flex-direction: column; /* Adapt layout */
  }
}

@media screen and (orientation: landscape) {
  .container {
    flex-direction: row; /* Adapt layout */
  }
}

/* Good: Responsive design that works in any orientation */
.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Essential exception: Piano app, level game */
.piano-app {
  /* Landscape may be essential for piano keyboard layout */
}
```

**React Implementation:**
```jsx
// Bad: Blocking content based on orientation
function App() {
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  if (!isLandscape) {
    return (
      <div className="rotate-message">
        <p>Please rotate your device to landscape mode</p>
      </div>
    );
  }

  return <MainContent />;
}

// Good: Adapt layout to orientation
function App() {
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app app-${orientation}`}>
      <MainContent />
    </div>
  );
}
```

**Testing:**
- [ ] Test site in portrait mode (phone vertical)
- [ ] Test site in landscape mode (phone horizontal)
- [ ] All functionality available in both orientations
- [ ] No messages forcing orientation change
- [ ] Content reflows appropriately
- [ ] Forms work in both orientations
- [ ] Navigation accessible in both modes

**Exceptions:**
- Bank check deposits (specific angle required)
- Piano/musical instrument apps (layout essential)
- Projector slides or presentations
- Virtual reality applications
- Games where orientation is part of gameplay

**Common Violations:**
- Video players forcing landscape
- Forms requiring landscape "for better experience"
- Dashboard apps blocking portrait view
- "Rotate your device" overlays

**Tools:**
- Test on mobile device (rotate physically)
- Chrome DevTools device emulation (toggle orientation)
- Responsive design mode in browsers

---

#### ✅ 1.3.5 Identify Input Purpose (Level AA) ⭐

**Requirement:** The purpose of input fields collecting user information can be programmatically determined when the field collects common user data (name, email, address, phone, etc.).

**Why This Matters:**
Browsers and assistive technologies can auto-fill forms, reducing errors and cognitive load. Users with motor or cognitive disabilities especially benefit.

**Implementation:**
```html
<!-- Good: Autocomplete attributes for common fields -->
<form>
  <!-- Personal Information -->
  <label for="name">Full Name</label>
  <input
    id="name"
    name="name"
    type="text"
    autocomplete="name"
  />

  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
  />

  <label for="tel">Phone</label>
  <input
    id="tel"
    name="tel"
    type="tel"
    autocomplete="tel"
  />

  <label for="bday">Birthday</label>
  <input
    id="bday"
    name="bday"
    type="date"
    autocomplete="bday"
  />

  <!-- Address Fields -->
  <label for="street">Street Address</label>
  <input
    id="street"
    name="street"
    autocomplete="street-address"
  />

  <label for="city">City</label>
  <input
    id="city"
    name="city"
    autocomplete="address-level2"
  />

  <label for="state">State</label>
  <input
    id="state"
    name="state"
    autocomplete="address-level1"
  />

  <label for="zip">ZIP Code</label>
  <input
    id="zip"
    name="zip"
    autocomplete="postal-code"
  />

  <label for="country">Country</label>
  <input
    id="country"
    name="country"
    autocomplete="country-name"
  />

  <!-- Payment Information -->
  <label for="cc-name">Cardholder Name</label>
  <input
    id="cc-name"
    name="cc-name"
    autocomplete="cc-name"
  />

  <label for="cc-number">Card Number</label>
  <input
    id="cc-number"
    name="cc-number"
    autocomplete="cc-number"
  />

  <label for="cc-exp">Expiration (MM/YY)</label>
  <input
    id="cc-exp"
    name="cc-exp"
    autocomplete="cc-exp"
  />

  <label for="cc-csc">Security Code</label>
  <input
    id="cc-csc"
    name="cc-csc"
    autocomplete="cc-csc"
  />
</form>
```

**React Implementation:**
```jsx
// Good: Profile form with autocomplete
function ProfileForm() {
  return (
    <form>
      <div>
        <label htmlFor="given-name">First Name</label>
        <input
          id="given-name"
          name="given-name"
          type="text"
          autoComplete="given-name"
        />
      </div>

      <div>
        <label htmlFor="family-name">Last Name</label>
        <input
          id="family-name"
          name="family-name"
          type="text"
          autoComplete="family-name"
        />
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="organization">Company</label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
        />
      </div>

      <div>
        <label htmlFor="work-email">Work Email</label>
        <input
          id="work-email"
          name="work-email"
          type="email"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="work-tel">Work Phone</label>
        <input
          id="work-tel"
          name="work-tel"
          type="tel"
          autoComplete="tel"
        />
      </div>
    </form>
  );
}

// Shipping address form
function ShippingForm() {
  return (
    <form>
      <fieldset>
        <legend>Shipping Address</legend>

        <input
          type="text"
          autoComplete="shipping name"
          placeholder="Full Name"
        />
        <input
          type="text"
          autoComplete="shipping street-address"
          placeholder="Street Address"
        />
        <input
          type="text"
          autoComplete="shipping address-level2"
          placeholder="City"
        />
        <input
          type="text"
          autoComplete="shipping address-level1"
          placeholder="State"
        />
        <input
          type="text"
          autoComplete="shipping postal-code"
          placeholder="ZIP"
        />
        <input
          type="text"
          autoComplete="shipping country-name"
          placeholder="Country"
        />
      </fieldset>

      <fieldset>
        <legend>Billing Address</legend>

        <input
          type="text"
          autoComplete="billing name"
          placeholder="Full Name"
        />
        <input
          type="text"
          autoComplete="billing street-address"
          placeholder="Street Address"
        />
        {/* ... more billing fields ... */}
      </fieldset>
    </form>
  );
}
```

**Common Autocomplete Values:**
- `name` - Full name
- `given-name` - First name
- `family-name` - Last name
- `email` - Email address
- `username` - Username
- `new-password` - New password (signup)
- `current-password` - Current password (login)
- `one-time-code` - One-time password/code
- `organization` - Company/organization
- `street-address` - Street address (multiline)
- `address-line1`, `address-line2` - Address lines
- `address-level1` - State/province
- `address-level2` - City
- `postal-code` - ZIP/postal code
- `country-name` - Country name
- `tel` - Phone number
- `bday` - Birthday
- `cc-name` - Credit card name
- `cc-number` - Credit card number
- `cc-exp` - Expiration date
- `cc-csc` - Security code

**Prefixes:**
- `shipping` - Shipping address fields
- `billing` - Billing address fields
- `work` - Work-related contact
- `home` - Home-related contact

**Testing:**
- [ ] All personal info fields have autocomplete attribute
- [ ] Address fields use appropriate autocomplete values
- [ ] Payment fields use cc-* autocomplete values
- [ ] Browser can auto-fill forms
- [ ] Password managers can detect fields
- [ ] Test with browser autofill enabled

**Tools:**
- Browser autofill testing (fill forms once, check auto-populate)
- axe DevTools (checks for autocomplete attributes)
- Manual inspection of form HTML

---

### 1.4 Distinguishable

#### ✅ 1.4.1 Use of Color (Level A)

**Requirement:** Color is not the only visual means of conveying information.

**Implementation:**
```html
<!-- Bad: Color only -->
<span style="color: red;">Error</span>

<!-- Good: Icon + color + text -->
<span class="error">
  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
  Error: Email is required
</span>

<!-- Good: Underlined links -->
<a href="..." class="underline">Link text</a>
```

**Testing:**
- [ ] Links are underlined or have distinct styling beyond color
- [ ] Error messages use icons/text, not just red color
- [ ] Required fields indicated with asterisk, not just color
- [ ] Charts/graphs use patterns or labels, not just colors

---

#### ✅ 1.4.2 Audio Control (Level A)

**Requirement:** If audio plays automatically for more than 3 seconds, provide a mechanism to pause, stop, or control the volume independently from the overall system volume.

**Why This Matters:**
Auto-playing audio interferes with screen readers and can be startling or disorienting. Users with screen readers cannot hear their assistive technology speak over background audio.

**Implementation:**
```jsx
// Good: Audio with controls and no autoplay
function AudioPlayer() {
  return (
    <div>
      <h2>Background Music</h2>
      <audio controls src="/background-music.mp3">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// Good: Auto-playing audio with immediate pause control
function AutoPlayAudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  // Ensure pause button is visible and accessible immediately
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} loop src="/ambient-sound.mp3" />

      {/* Control MUST be at top of page if audio auto-plays */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background audio' : 'Play background audio'}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '10px 20px',
          fontSize: '16px'
        }}
      >
        {isPlaying ? '⏸ Pause Audio' : '▶ Play Audio'}
      </button>
    </div>
  );
}

// Good: Volume control independent of system volume
function VideoWithVolumeControl() {
  const [volume, setVolume] = useState(0.5);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div>
      <video ref={videoRef} controls autoPlay muted>
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div>
        <label htmlFor="volume-slider">Volume:</label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Adjust video volume"
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}

// Bad: Auto-playing audio with no controls
function BadAudioImplementation() {
  return (
    <div>
      {/* ❌ Auto-plays, no way to stop, interferes with screen readers */}
      <audio autoPlay loop src="/background-music.mp3" />
      <h1>Welcome to Our Site</h1>
    </div>
  );
}

// Good: Auto-muted video (common pattern)
function HeroVideo() {
  return (
    <video
      autoPlay
      muted  // Muted videos are allowed to autoplay
      loop
      playsInline
      style={{ width: '100%' }}
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>
  );
}

// Good: User-initiated audio
function PlaySoundButton() {
  const [audio] = useState(new Audio('/notification.mp3'));

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return (
    <button onClick={playSound}>
      Play Notification Sound
    </button>
  );
}
```

**HTML Pattern:**
```html
<!-- Bad: Autoplay without controls -->
<audio autoplay loop>
  <source src="background-music.mp3" type="audio/mpeg">
</audio>

<!-- Good: Controls provided -->
<audio controls>
  <source src="background-music.mp3" type="audio/mpeg">
</audio>

<!-- Good: No autoplay (user must click play) -->
<audio controls>
  <source src="background-music.mp3" type="audio/mpeg">
</audio>

<!-- Acceptable: Autoplay with muted (no sound) -->
<video autoplay muted loop>
  <source src="background-video.mp4" type="video/mp4">
</video>
```

**Testing:**
- [ ] No audio plays automatically without user action
- [ ] OR if audio auto-plays, it stops within 3 seconds
- [ ] OR if audio auto-plays >3 seconds, pause/stop control is provided
- [ ] Pause/stop control is keyboard accessible
- [ ] Pause/stop control is near the top of the page (easily found)
- [ ] Volume control is independent of system volume
- [ ] Test with screen reader - verify audio doesn't interfere
- [ ] Background music can be paused without leaving page

**Common Issues:**
- Background music auto-playing with no stop button
- Auto-playing promotional videos with sound
- Sound effects that can't be disabled
- Pause button hidden in footer or hard to find
- Audio that only stops by leaving the page

**Acceptable Scenarios:**
- Audio plays for ≤ 3 seconds automatically
- Auto-muted video (no sound)
- User explicitly clicks play
- Pause control provided immediately (before audio starts or within first few seconds)

**Required Control Features:**
- Must be keyboard accessible
- Should be near top of page
- Clear label ("Pause Audio", "Stop Music", etc.)
- Works independently of system volume (not just "turn down your speakers")

**Tools:**
- Manual testing (load page and listen)
- Screen reader testing (verify audio doesn't interfere)
- Keyboard testing (verify controls are reachable)

**Exceptions:**
- Audio is ≤ 3 seconds
- Emergency alerts (may need to override, but provide control after initial alert)

**Best Practice:**
- Don't auto-play audio at all
- If you must auto-play, use muted video
- Provide prominent pause controls
- Remember user's preference (if they paused, don't auto-play on next page)

---

#### ✅ 1.4.3 Contrast (Minimum) - Level AA ⭐

**Requirement:** Text must have a contrast ratio of at least:
- **4.5:1** for normal text (< 18pt or < 14pt bold)
- **3.1** for large text (≥ 18pt or ≥ 14pt bold)
- **3:1** for UI components and graphical objects

**Implementation:**
```css
/* Good examples */
.high-contrast-text {
  color: #1a1a1a; /* Very dark gray */
  background-color: #ffffff; /* White */
  /* Ratio: 16.32:1 ✅ */
}

.primary-text {
  color: #6366f1; /* Indigo-500 */
  background-color: #1a1a1a; /* Very dark */
  /* Ratio: 5.95:1 ✅ */
}
```

**Testing:**
- [ ] Use WebAIM Contrast Checker
- [ ] Test all text colors against backgrounds
- [ ] Test button/border colors (3:1 minimum)
- [ ] Run axe DevTools color contrast audit

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools (inspect contrast ratio)
- axe DevTools

**My Web App Results:**
- Navbar buttons: 16.32:1 ✅
- Indigo text: 5.95:1 ✅
- Secondary text: 6.99:1 ✅
- Purple borders: 4.13:1 ✅

---

#### ✅ 1.4.4 Resize Text (Level AA) ⭐

**Requirement:** Text can be resized up to 200% without loss of content or functionality.

**Implementation:**
```css
/* Use relative units */
.text {
  font-size: 1rem; /* Good: relative */
  line-height: 1.5; /* Good: unitless */
}

/* Avoid absolute units */
.bad-text {
  font-size: 12px; /* Bad: doesn't scale well */
}
```

**Testing:**
- [ ] Zoom browser to 200%
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] No overlapping content

**Tools:**
- Browser zoom (Cmd/Ctrl + "+")

---

#### ✅ 1.4.5 Images of Text (Level AA) ⭐

**Requirement:** If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text, except for:
- **Customizable:** The image of text can be visually customized to the user's requirements
- **Essential:** A particular presentation of text is essential to the information being conveyed (e.g., logotypes)

**Why This Matters:**
Real text can be resized, recolored, and read by assistive technologies. Images of text cannot be customized by users and may become pixelated when zoomed. Screen readers cannot read text in images unless alt text is provided.

**Implementation:**
```jsx
// Bad: Using image for heading
function BadHeading() {
  return (
    <div>
      {/* ❌ Text in image - cannot be resized, recolored, or customized */}
      <img src="/heading-fancy-font.png" alt="Welcome to Our Site" />
    </div>
  );
}

// Good: Use real text with CSS styling
function GoodHeading() {
  return (
    <h1
      style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '3rem',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}
    >
      Welcome to Our Site
    </h1>
  );
}

// Bad: Button with text image
function BadButton() {
  return (
    <button>
      {/* ❌ Text in image */}
      <img src="/button-text.png" alt="Submit Form" />
    </button>
  );
}

// Good: Real text button with styling
function GoodButton() {
  return (
    <button
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      Submit Form
    </button>
  );
}

// Bad: Quote as image
function BadQuote() {
  return (
    <div>
      {/* ❌ Decorative quote in image format */}
      <img src="/inspirational-quote.jpg" alt="Believe in yourself" />
    </div>
  );
}

// Good: Styled quote with real text
function GoodQuote() {
  return (
    <blockquote
      style={{
        fontSize: '1.5rem',
        fontStyle: 'italic',
        borderLeft: '4px solid #667eea',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        color: '#374151'
      }}
    >
      "Believe in yourself"
      <footer style={{ fontSize: '1rem', fontStyle: 'normal', marginTop: '0.5rem' }}>
        — Motivational Speaker
      </footer>
    </blockquote>
  );
}

// Bad: Navigation menu as image map
function BadNavigation() {
  return (
    <img src="/navigation-menu.png" useMap="#navmap" alt="Navigation" />
  );
}

// Good: Real HTML/CSS navigation
function GoodNavigation() {
  return (
    <nav>
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2rem',
          padding: 0,
          margin: 0
        }}
      >
        <li>
          <a href="/" style={{ textDecoration: 'none', color: '#374151' }}>
            Home
          </a>
        </li>
        <li>
          <a href="/about" style={{ textDecoration: 'none', color: '#374151' }}>
            About
          </a>
        </li>
        <li>
          <a href="/contact" style={{ textDecoration: 'none', color: '#374151' }}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

// Acceptable: Logo (essential)
function LogoExample() {
  return (
    <div>
      {/* ✅ Logos are acceptable as images of text */}
      <img
        src="/company-logo.png"
        alt="Acme Corporation"
        style={{ height: '40px' }}
      />
    </div>
  );
}

// Acceptable: Customizable image of text
function CustomizableTextImage({ userFontSize, userColor }) {
  // Generate image with user's preferences
  const imageUrl = `/api/generate-text?text=Welcome&size=${userFontSize}&color=${userColor}`;

  return (
    <div>
      <div>
        <label>
          Font Size:
          <input type="range" min="12" max="72" /* ... */ />
        </label>
        <label>
          Color:
          <input type="color" /* ... */ />
        </label>
      </div>
      <img src={imageUrl} alt="Welcome" />
    </div>
  );
}

// Modern CSS alternatives to images of text
const CSSAlternatives = {
  // Fancy fonts
  webFonts: `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
    }
  `,

  // Gradient text
  gradientText: `
    .gradient-text {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `,

  // Text shadows and effects
  textEffects: `
    .shadow-text {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .outline-text {
      text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
      color: white;
    }
  `,

  // Custom shapes with CSS
  shapes: `
    .circle-text {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `
};
```

**When Images of Text ARE Acceptable:**

**1. Logotypes (Company/Product Names):**
```jsx
// ✅ Acceptable
<img src="/brand-logo.svg" alt="Company Name Inc." />
```

**2. Essential Presentation:**
- Historical documents (preserving original appearance)
- Artistic text (part of artwork)
- Screenshots demonstrating specific visual appearance
- Handwriting or signatures

**3. Customizable:**
```jsx
// ✅ Acceptable if user can customize
function UserCustomizableText({ fontSize, fontColor }) {
  // Generate image based on user preferences
  return <img src={`/api/text?size=${fontSize}&color=${fontColor}`} alt="..." />;
}
```

**Common Violations:**
- Decorative headings as images
- Navigation menus as image maps
- Buttons with text as images
- Quotes/testimonials as graphics
- Pricing tables as images
- Feature callouts as graphics

**Testing:**
- [ ] All text is real HTML text, not images
- [ ] OR images of text fall into acceptable categories (logos, essential)
- [ ] Try to select text with mouse - if you can't, it might be an image
- [ ] Zoom page to 200% - does text remain sharp or pixelated?
- [ ] Check if text can be customized by browser/OS settings
- [ ] Use "Select All" (Cmd/Ctrl+A) - does it select all text?
- [ ] Inspect element in DevTools - is it actual text or img tag?

**How to Check:**
```javascript
// Find all images on page
document.querySelectorAll('img').forEach(img => {
  // Check alt text - might indicate text in image
  if (img.alt && img.alt.length > 5) {
    console.log('Potential text image:', img.src, 'Alt:', img.alt);
  }
});

// Check for background images (CSS)
document.querySelectorAll('*').forEach(el => {
  const bg = window.getComputedStyle(el).backgroundImage;
  if (bg !== 'none') {
    console.log('Element with background image:', el, bg);
  }
});
```

**Modern CSS Can Replace Most Images of Text:**
```css
/* Fancy fonts */
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');

/* Gradient text */
.gradient {
  background: linear-gradient(90deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Text effects */
.shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
.outline { -webkit-text-stroke: 2px black; }

/* Rotated text */
.rotated { transform: rotate(-5deg); }

/* Custom shapes */
.badge {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

**Benefits of Real Text:**
- Resizable without pixelation
- Can be selected and copied
- Works with browser/OS text customization
- Better SEO
- Translatable by browser translation tools
- Smaller file size
- Screen reader compatible without alt text
- Color schemes can be applied

**Tools:**
- Manual inspection (try to select text)
- Zoom test (real text stays sharp)
- DevTools inspection
- WAVE extension (flags images of text)

**Exceptions:**
- Logos and branding
- Essential presentation (historical documents, artwork)
- User-customizable generated images
- Text that is part of a photograph (incidental)

---

#### ✅ 1.4.10 Reflow (Level AA) ⭐

**Requirement:** Content reflows to single column at 320px width without scrolling.

**Implementation:**
```css
/* Responsive design */
@media (max-width: 640px) {
  .grid {
    display: block; /* Stack vertically */
  }
}
```

**Testing:**
- [ ] Resize browser to 320px wide
- [ ] No horizontal scrolling
- [ ] Content adapts to narrow viewport

**Tools:**
- Browser DevTools (responsive mode)

---

#### ✅ 1.4.11 Non-text Contrast (Level AA) ⭐

**Requirement:** UI components and graphical objects have 3:1 contrast ratio.

**Implementation:**
```css
/* Button borders, focus indicators, icons */
.button {
  border: 2px solid #6366f1; /* 3:1+ against background */
}

.focus-visible {
  outline: 2px solid #6366f1; /* 3:1+ against background */
}
```

**Testing:**
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Form input borders meet 3:1
- [ ] Icons/graphics meet 3:1

**Tools:**
- WebAIM Contrast Checker
- axe DevTools

---

#### ✅ 1.4.12 Text Spacing (Level AA) ⭐

**Requirement:** No loss of content or functionality when users adjust text spacing to:
- Line height (line spacing) to at least 1.5x the font size
- Paragraph spacing to at least 2x the font size
- Letter spacing (tracking) to at least 0.12x the font size
- Word spacing to at least 0.16x the font size

**Why This Matters:**
Users with dyslexia, low vision, or cognitive disabilities often need increased text spacing for readability. Content must accommodate these adjustments without breaking layout.

**Implementation:**
```css
/* Good: Flexible layout that handles text spacing */
.content {
  max-width: 800px;
  /* Don't use fixed heights */
  min-height: auto; /* Allow content to expand */
}

.card {
  padding: 1.5rem;
  /* Avoid pixel-perfect layouts */
  overflow: visible; /* Don't hide overflow text */
}

.text {
  /* Already using relative spacing */
  line-height: 1.5; /* Default good spacing */
  margin-bottom: 1em; /* Relative spacing */
}

/* Bad: Fixed heights that break with increased spacing */
.bad-card {
  height: 200px; /* Fixed - text will overflow */
  overflow: hidden; /* Hides overflowing text */
}

.bad-text {
  line-height: 1.2; /* Too tight */
  margin-bottom: 10px; /* Fixed pixel spacing */
}

/* Support user text spacing preferences */
@media (prefers-contrast: more) {
  /* User may also need more spacing with high contrast */
  p {
    line-height: 1.6;
    letter-spacing: 0.05em;
  }
}
```

**Testing with Bookmarklet:**
```javascript
// Text Spacing Bookmarklet - test your site
// Applies the required spacing adjustments
javascript:(function(){
  const style = document.createElement('style');
  style.textContent = `
    * {
      line-height: 1.5 !important;
      letter-spacing: 0.12em !important;
      word-spacing: 0.16em !important;
    }
    p {
      margin-bottom: 2em !important;
    }
  `;
  document.head.appendChild(style);
})();
```

**React Implementation:**
```jsx
// Good: Flexible components
const Card = styled.div`
  padding: 1.5rem;
  /* No fixed height */
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  /* Text can expand naturally */
  h2 {
    line-height: 1.4;
    margin-bottom: 0.5em; /* Relative to font size */
  }

  p {
    line-height: 1.6;
    margin-bottom: 1em;
  }
`;

// Bad: Fixed dimensions
const BadCard = styled.div`
  height: 300px; /* Fixed height */
  overflow: hidden; /* Clips content */
  padding: 20px;

  p {
    line-height: 20px; /* Fixed line height */
    margin-bottom: 10px; /* Fixed margin */
  }
`;

// Good: Respect user's text spacing
function Article({ content }) {
  return (
    <article style={{
      lineHeight: '1.6',
      maxWidth: '65ch', // Flexible based on character width
    }}>
      {content}
    </article>
  );
}
```

**Common Layout Issues:**
```css
/* Problems that break with text spacing */

/* 1. Fixed heights */
.button {
  height: 40px; /* Can't accommodate taller text */
  /* Fix: Use padding instead */
  padding: 0.5rem 1rem;
}

/* 2. Overflow hidden */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* May hide content when spacing increased */
}

/* 3. Absolute positioning based on text height */
.tooltip {
  position: absolute;
  top: 25px; /* Assumes specific text height */
  /* Fix: Use relative positioning or auto-calculate */
}

/* 4. Fixed line-height values */
.heading {
  line-height: 24px; /* Fixed - bad */
  /* Fix: Use unitless or relative */
  line-height: 1.2; /* Good */
}
```

**Testing:**
- [ ] Use text spacing bookmarklet or browser extension
- [ ] Increase line height to 1.5x
- [ ] Increase paragraph spacing to 2x
- [ ] Increase letter spacing to 0.12x
- [ ] Increase word spacing to 0.16x
- [ ] Verify no content is cut off
- [ ] Verify no overlapping text
- [ ] Verify all functionality still works
- [ ] Test interactive elements (buttons, links, forms)
- [ ] Check navigation doesn't break
- [ ] Ensure modal/popup content fits

**Common Violations:**
- Fixed height containers causing text overflow
- Hidden overflow clipping expanded text
- Buttons with fixed heights cutting off text
- Navigation items overlapping
- Tooltips positioned incorrectly
- Forms with fixed-height inputs cutting text

**Tools:**
- Text Spacing Bookmarklet: https://www.html5accessibility.com/tests/tsbookmarklet.html
- Browser extensions for text spacing
- Chrome DevTools (edit styles to test)
- Manual CSS injection

**Exceptions:**
- Captions in videos (essential presentation)
- Images of text (discouraged but exempt if essential)
- Text in images for logos

---

#### ✅ 1.4.13 Content on Hover or Focus (Level AA) ⭐

**Requirement:** When additional content appears on hover or focus (tooltips, dropdowns, etc.), it must be:
1. **Dismissible:** User can dismiss without moving pointer/focus (typically ESC key)
2. **Hoverable:** If triggered by pointer hover, pointer can move over the new content without it disappearing
3. **Persistent:** Content remains visible until user dismisses it, or it's no longer relevant

**Why This Matters:**
Users with low vision who magnify screens need time to read hover content. Users with motor impairments may accidentally trigger hovers and need to dismiss them.

**Implementation:**
```jsx
// Good: Accessible tooltip
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Dismissible: ESC key closes tooltip
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        setIsDismissed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  const show = () => {
    if (!isDismissed) {
      setIsVisible(true);
    }
  };

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <div
          id="tooltip"
          ref={tooltipRef}
          role="tooltip"
          // Hoverable: Mouse can move over tooltip content
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={hide}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            marginTop: '0.5rem',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            // Persistent: Stays visible until dismissed
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Usage
<Tooltip content="This is helpful information">
  <button>Hover for info</button>
</Tooltip>

// Good: Accessible dropdown
function Dropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Dismissible: ESC key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // Persistent: Click outside closes
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
      </button>

      {isOpen && (
        <ul
          role="menu"
          // Hoverable: Can move mouse over menu items
          onMouseLeave={() => {
            // Optional: Keep open when hovering menu
          }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: '0.5rem 0',
            margin: 0,
            zIndex: 1000,
          }}
        >
          {items.map((item, index) => (
            <li key={index} role="menuitem">
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Good: Hover-triggered submenu
function NavigationMenu() {
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  const showSubmenu = (menuId) => {
    // Clear any pending hide
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  const hideSubmenu = () => {
    // Persistent: Small delay before hiding
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  const keepSubmenu = () => {
    // Hoverable: Cancel hide when hovering submenu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <nav>
      <ul>
        <li
          onMouseEnter={() => showSubmenu('products')}
          onMouseLeave={hideSubmenu}
        >
          <a href="/products">Products</a>

          {activeMenu === 'products' && (
            <ul
              onMouseEnter={keepSubmenu}
              onMouseLeave={hideSubmenu}
              style={{
                position: 'absolute',
                background: 'white',
                border: '1px solid #ccc',
              }}
            >
              <li><a href="/products/item1">Item 1</a></li>
              <li><a href="/products/item2">Item 2</a></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Bad: Tooltip that fails requirements
function BadTooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>

      {isVisible && (
        <div
          style={{
            position: 'absolute',
            background: 'black',
            color: 'white',
            padding: '0.5rem',
            // Problems:
            // ❌ Not dismissible with ESC
            // ❌ Can't hover over tooltip (disappears on mouse leave)
            // ❌ Disappears immediately (not persistent)
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

**CSS-Only Pattern (With Limitations):**
```css
/* CSS-only tooltip - partially accessible */
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container:hover .tooltip-content,
.tooltip-container:focus-within .tooltip-content {
  display: block;
}

.tooltip-content {
  display: none;
  position: absolute;
  background: #1a1a1a;
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  z-index: 1000;

  /* Hoverable: Leave small gap or use pointer-events */
  pointer-events: auto; /* Can hover over tooltip */
}

/* Note: CSS-only can't be dismissed with ESC key */
/* JavaScript is needed for full compliance */
```

**Testing:**
- [ ] **Dismissible:** Press ESC to close tooltips/popups
- [ ] **Dismissible:** Doesn't require moving mouse/focus away
- [ ] **Hoverable:** Move mouse from trigger to new content
- [ ] **Hoverable:** Content stays visible while hovering it
- [ ] **Persistent:** Content doesn't disappear unexpectedly
- [ ] **Persistent:** Remains until ESC, click outside, or focus moves
- [ ] Test with screen magnification
- [ ] Test with slow/imprecise mouse movement

**Common Violations:**
- Tooltips that disappear when trying to hover them
- Submenus that close too quickly
- Hover content with no ESC dismissal
- Tooltips that vanish on tiny mouse movement
- Content that appears/disappears too rapidly

**Exceptions:**
- Browser-controlled tooltips (title attribute)
- Error messages controlled by user agent
- Content not triggered by hover/focus (e.g., timed notifications)

**Tools:**
- Manual keyboard testing (ESC key)
- Mouse movement testing
- Screen magnifier testing (ZoomText, built-in magnifier)
- Test with tremor/motor impairment simulation

---

## Principle 2: Operable

### 2.1 Keyboard Accessible

#### ✅ 2.1.1 Keyboard (Level A)

**Requirement:** All functionality is available via keyboard.

**Implementation:**
```jsx
// All interactive elements must be keyboard accessible
<button onClick={handleClick}>Click me</button> // ✅ Good
<div onClick={handleClick}>Click me</div> // ❌ Bad - not keyboard accessible

// Custom components need keyboard handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

**Testing:**
- [ ] Tab through all interactive elements
- [ ] All buttons/links reachable
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate menus/lists

**Tools:**
- Keyboard only (disconnect mouse!)
- Browser tab navigation

---

#### ✅ 2.1.2 No Keyboard Trap (Level A)

**Requirement:** Users can navigate away from any component using only keyboard.

**Implementation:**
```jsx
// Modal with keyboard trap prevention
function Modal({ onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return <div role="dialog">...</div>;
}
```

**Testing:**
- [ ] Can exit all modals/dialogs with Escape
- [ ] Can tab out of all components
- [ ] No infinite tab loops

---

#### ✅ 2.1.4 Character Key Shortcuts (Level A) 🆕 WCAG 2.2

**Requirement:** If a keyboard shortcut uses only printable character keys (letters, numbers, punctuation, symbols), then at least one of the following is true:
- Can be turned off
- Can be remapped to include non-printable keys (Ctrl, Alt, etc.)
- Is only active when component has focus

**Why This Matters:**
Single-key shortcuts can be accidentally triggered by speech recognition users or cause conflicts with assistive technology.

**Implementation:**
```jsx
// Bad: Single-key shortcuts active globally
document.addEventListener('keydown', (e) => {
  if (e.key === 's') {
    save(); // Problem: 's' triggered while typing
  }
});

// Good: Require modifier key
document.addEventListener('keydown', (e) => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    save(); // Ctrl+S or Cmd+S
  }
});

// Good: Only active when component focused
function Editor() {
  const editorRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      save();
    }
  };

  return (
    <div
      ref={editorRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      Editor content
    </div>
  );
}

// Good: Allow users to disable shortcuts
function Settings() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  return (
    <label>
      <input
        type="checkbox"
        checked={shortcutsEnabled}
        onChange={(e) => setShortcutsEnabled(e.target.checked)}
      />
      Enable keyboard shortcuts
    </label>
  );
}
```

**Testing:**
- [ ] All single-character shortcuts require Ctrl/Alt/Cmd modifier
- [ ] OR single-character shortcuts can be turned off in settings
- [ ] OR single-character shortcuts only work when specific component has focus
- [ ] Test with speech recognition (Dragon NaturallySpeaking, Voice Control)
- [ ] No conflicts with screen reader shortcuts

**Common Issues:**
- Search activated with '/' key while typing in forms
- Delete triggered with 'D' key during text entry
- Single-letter navigation (like Gmail) interfering with text input

**Tools:**
- Manual keyboard testing
- Speech recognition software testing

---

### 2.2 Enough Time

#### ✅ 2.2.1 Timing Adjustable (Level A)

**Requirement:** For each time limit set by content, users can turn off, adjust, or extend the time limit before time expires.

**Exceptions:** Real-time events (auctions, real-time games), essential time limits (20+ hour limits), or time limits longer than 20 hours.

**Implementation:**
```jsx
// Session timeout with extension option
function SessionTimeout() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 60 && !showWarning) {
          setShowWarning(true); // Show warning at 1 minute
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const extendSession = () => {
    setTimeLeft(600); // Extend by 10 more minutes
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div role="alert" aria-live="assertive">
      <p>Your session will expire in {timeLeft} seconds.</p>
      <button onClick={extendSession}>
        Extend Session
      </button>
    </div>
  );
}

// Alternative: Allow users to disable timeout
function Settings() {
  const [timeoutEnabled, setTimeoutEnabled] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={timeoutEnabled}
        onChange={(e) => setTimeoutEnabled(e.target.checked)}
      />
      Enable automatic logout (for security)
    </label>
  );
}
```

**Testing:**
- [ ] Users warned at least 20 seconds before timeout
- [ ] Users can extend timeout at least 10 times
- [ ] OR timeout can be disabled in settings
- [ ] Timeout warning is accessible (screen reader announces)

---

#### ✅ 2.2.2 Pause, Stop, Hide (Level A)

**Requirement:** For moving, blinking, scrolling, or auto-updating content:
- **Moving/blinking/scrolling:** Can be paused, stopped, or hidden if it starts automatically, lasts >5 seconds, and is presented in parallel with other content
- **Auto-updating:** Can be paused, stopped, hidden, or controlled

**Implementation:**
```jsx
// Auto-playing carousel with pause
function Carousel({ slides }) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div aria-live="polite" aria-atomic="true">
        {slides[currentSlide]}
      </div>
      <button
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      <div role="group" aria-label="Slide navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Live updates with pause
function LiveFeed({ updates }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? 'Resume Updates' : 'Pause Updates'}
      </button>
      <div aria-live={isPaused ? 'off' : 'polite'}>
        {updates.map((update) => (
          <div key={update.id}>{update.content}</div>
        ))}
      </div>
    </div>
  );
}
```

**Testing:**
- [ ] All auto-playing content can be paused
- [ ] Pause control is keyboard accessible
- [ ] Content pauses on hover/focus
- [ ] Pausing doesn't hide other content

---

### 2.3 Seizures and Physical Reactions

#### ✅ 2.3.1 Three Flashes or Below Threshold (Level A)

**Requirement:** Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.

**Why This Matters:**
Flashing content can trigger seizures in people with photosensitive epilepsy. Even brief flashing can cause seizures, disorientation, or nausea.

**Implementation:**
```jsx
// Bad: Flashing animation
function BadFlashingAlert() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // ❌ Flashes 5 times per second - DANGEROUS
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 200); // Flashes every 200ms = 5 times/second

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: isVisible ? 'red' : 'white',
      padding: '20px'
    }}>
      URGENT ALERT
    </div>
  );
}

// Good: Non-flashing animation
function GoodPulseAnimation() {
  return (
    <div
      style={{
        animation: 'pulse 2s ease-in-out infinite',
        background: 'red',
        padding: '20px'
      }}
    >
      URGENT ALERT
    </div>
  );
}

// CSS for good animation (smooth, not flashing)
const styles = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

// Good: Static notification with movement
function SafeNotification({ message }) {
  return (
    <div
      role="alert"
      style={{
        background: '#fee2e2',
        border: '2px solid #ef4444',
        borderRadius: '8px',
        padding: '16px',
        // Slide in instead of flash
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {message}
    </div>
  );
}

// CSS for slide animation
const slideInStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Good: Attention-getting without flashing
function AttentionBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        padding: '16px',
        // Gentle animation, not flashing
        animation: 'gentle-pulse 3s ease-in-out infinite'
      }}
    >
      <strong>⚠️ Important:</strong> Your session will expire in 5 minutes.
    </div>
  );
}

const gentlePulseStyles = `
  @keyframes gentle-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
`;

// Testing: Measure flash rate
function FlashRateChecker() {
  const [flashCount, setFlashCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = () => {
    setFlashCount(0);
    setIsMonitoring(true);

    // Count flashes for 1 second
    setTimeout(() => {
      setIsMonitoring(false);
    }, 1000);
  };

  return (
    <div>
      <p>Flash count in 1 second: {flashCount}</p>
      {flashCount > 3 && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ WARNING: Exceeds 3 flashes per second - FAILS WCAG 2.3.1
        </p>
      )}
      <button onClick={startMonitoring}>
        Test Flash Rate
      </button>
    </div>
  );
}
```

**Safe Alternatives to Flashing:**
```jsx
// 1. Smooth fade animations
const FadeAnimation = styled.div`
  animation: fade 2s ease-in-out infinite;

  @keyframes fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// 2. Slide animations
const SlideAnimation = styled.div`
  animation: slide 1s ease-out;

  @keyframes slide {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// 3. Gentle color transitions
const ColorTransition = styled.div`
  animation: color-change 3s ease-in-out infinite;

  @keyframes color-change {
    0%, 100% { background-color: #3b82f6; }
    50% { background-color: #2563eb; }
  }
`;

// 4. Rotate/spin (not flashing)
const SpinAnimation = styled.div`
  animation: spin 2s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// 5. Scale/bounce
const BounceAnimation = styled.div`
  animation: bounce 2s ease-in-out infinite;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;
```

**Flash Thresholds:**
- **General Flash Threshold:** A flash or rapidly changing image sequence is below the threshold if:
  - Flashes 3 times or less in any 1-second period, OR
  - The combined area flashing is less than 25% of a 10-degree visual field (roughly 341 x 256 pixels at typical viewing distance), OR
  - The relative luminance changes are small

- **Red Flash Threshold:** Additional requirements for saturated red flashing

**Testing:**
- [ ] No content flashes more than 3 times per second
- [ ] Animations use smooth transitions, not rapid on/off states
- [ ] Test all animations, videos, GIFs
- [ ] Use Photosensitive Epilepsy Analysis Tool (PEAT) if available
- [ ] Review any rapidly changing content
- [ ] Check video content for flashing scenes
- [ ] Verify animated GIFs don't flash rapidly

**Common Violations:**
- Rapid on/off toggle animations
- Strobe effects
- Lightning effects in videos
- Emergency vehicle lights in videos/GIFs
- Flashing banner ads
- Camera flashes in photo slideshows
- Blinking cursors or indicators faster than 3Hz

**Safe Practices:**
- Use smooth CSS transitions (`transition: opacity 0.3s ease`)
- Fade animations instead of blinking
- Slide or scale animations
- Limit animation frequency to ≤ 2 times per second
- Review all third-party content (ads, embeds) for flashing
- If video contains flashing, provide warning and alternative

**Video Content:**
```jsx
// Good: Video with flash warning
function VideoWithWarning({ videoUrl, hasFlashing }) {
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(!hasFlashing);

  if (!acknowledgedWarning) {
    return (
      <div
        role="alertdialog"
        aria-labelledby="warning-title"
        aria-describedby="warning-desc"
      >
        <h2 id="warning-title">⚠️ Warning</h2>
        <p id="warning-desc">
          This video contains flashing lights that may trigger seizures
          in people with photosensitive epilepsy. Viewer discretion is advised.
        </p>
        <button onClick={() => setAcknowledgedWarning(true)}>
          I Understand, Continue
        </button>
        <button onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <video controls>
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}
```

**Tools:**
- **PEAT (Photosensitive Epilepsy Analysis Tool)** - Free tool from Trace Research & Development Center
- Manual inspection of animations
- Slow-motion video review
- Browser DevTools performance recording

**Exceptions:**
- None. This is a critical safety requirement with no exceptions.

**Legal Note:**
Violating this criterion can cause real physical harm. In some jurisdictions, triggering seizures through flashing content could result in legal liability.

**Resources:**
- Epilepsy Foundation: https://www.epilepsy.com/
- Photosensitive Epilepsy Analysis Tool: https://trace.umd.edu/peat
- W3C Understanding 2.3.1: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold

---

#### ✅ 2.3.3 Animation from Interactions (Level AAA - Bonus)

**Requirement:** Motion animation can be disabled except when essential.

**Implementation:**
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:**
- [ ] Enable "Reduce motion" in system settings
- [ ] Verify animations are disabled

**Tools:**
- macOS: System Preferences → Accessibility → Display → Reduce Motion
- Windows: Settings → Ease of Access → Display → Show animations

---

### 2.4 Navigable

#### ✅ 2.4.1 Bypass Blocks (Level A)

**Requirement:** Skip navigation mechanism to bypass repeated content.

**Implementation:**
```jsx
// Skip link (first focusable element)
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Target for skip link
<main id="main-content">
  {/* Page content */}
</main>
```

```css
/* Show skip link only on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**Testing:**
- [ ] Press Tab on page load
- [ ] Skip link appears
- [ ] Clicking skip link jumps to main content

---

#### ✅ 2.4.2 Page Titled (Level A)

**Requirement:** Web pages have descriptive titles.

**Implementation:**
```jsx
// Using React Helmet
import { Helmet } from 'react-helmet-async';

function BlogPost({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title} | My Web App</title>
      </Helmet>
      {/* ... */}
    </>
  );
}
```

**Testing:**
- [ ] Every page has unique `<title>` tag
- [ ] Titles describe page content
- [ ] Titles follow pattern: "Page Name | Site Name"

---

#### ✅ 2.4.3 Focus Order (Level A)

**Requirement:** Focus order is logical and meaningful.

**Implementation:**
- Use natural DOM order (don't manipulate with `tabindex` unless necessary)
- Avoid positive `tabindex` values

**Testing:**
- [ ] Tab through page in visual order
- [ ] Focus doesn't jump unexpectedly

---

#### ✅ 2.4.4 Link Purpose (In Context) (Level A)

**Requirement:** Purpose of each link can be determined from link text or context.

**Implementation:**
```jsx
// Bad: Generic link text
<a href="/post">Read more</a>

// Good: Descriptive link text
<a href="/post">Read article: Getting Started with React</a>

// Good: aria-label for context
<a href="/post" aria-label="Read article: Getting Started with React. Learn the basics of React components and hooks.">
  <img src="thumbnail.jpg" alt="" />
  <h3>Getting Started with React</h3>
</a>
```

**Testing:**
- [ ] No "click here" or "read more" without context
- [ ] Links describe their destination
- [ ] Icon links have aria-label

---

#### ✅ 2.4.5 Multiple Ways (Level AA) ⭐

**Requirement:** More than one way to locate pages within a set.

**Implementation:**
- Navigation menu
- Search functionality
- Sitemap page
- Breadcrumbs

**Testing:**
- [ ] Site has navigation menu
- [ ] Site has search
- [ ] Site has sitemap (/sitemap or /sitemap.html)

---

#### ✅ 2.4.6 Headings and Labels (Level AA) ⭐

**Requirement:** Headings and labels describe topic or purpose.

**Implementation:**
```html
<h1>Blog Posts</h1>
<h2>Latest Articles</h2>
<h3>Getting Started with React</h3>

<label for="email">Email Address</label>
<input type="email" id="email" />
```

**Testing:**
- [ ] Headings are descriptive
- [ ] Form labels are clear

---

#### ✅ 2.4.7 Focus Visible (Level AA) ⭐

**Requirement:** Keyboard focus indicator is visible.

**Implementation:**
```css
/* Default browser focus */
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom focus indicator */
.link:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}
```

**Testing:**
- [ ] Tab through page
- [ ] Focus indicator clearly visible on all elements
- [ ] Contrast ratio meets 3:1 minimum

**Tools:**
- Keyboard navigation

---

#### ✅ 2.4.11 Focus Not Obscured (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** When a component receives keyboard focus, it is not entirely hidden by author-created content (like sticky headers, cookie banners, chat widgets).

**Why This Matters:**
Users relying on keyboard navigation need to see what element has focus. Fixed-position UI elements can completely cover focused elements, making navigation impossible.

**Implementation:**
```jsx
// Ensure focused elements scroll into view and aren't obscured
function scrollToFocused(element) {
  const headerHeight = document.querySelector('header').offsetHeight;
  const elementTop = element.getBoundingClientRect().top;
  const offsetPosition = elementTop + window.pageYOffset - headerHeight - 20;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Automatically manage scroll position for focus
useEffect(() => {
  const handleFocus = (e) => {
    // Check if element is partially obscured by fixed elements
    const rect = e.target.getBoundingClientRect();
    const header = document.querySelector('[data-sticky-header]');

    if (header) {
      const headerRect = header.getBoundingClientRect();
      // If focus is behind header, scroll it into view
      if (rect.top < headerRect.bottom) {
        scrollToFocused(e.target);
      }
    }
  };

  document.addEventListener('focus', handleFocus, true);
  return () => document.removeEventListener('focus', handleFocus, true);
}, []);

// Ensure modals don't obscure focus
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first focusable element in modal
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}

// Ensure sticky headers don't cover focus
const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  /* Add enough padding to page content below */
  & + main {
    scroll-padding-top: ${props => props.height + 20}px;
  }
`;
```

**CSS Solution:**
```css
/* Ensure scroll targets account for fixed headers */
html {
  scroll-padding-top: 80px; /* Height of sticky header + buffer */
}

/* Ensure focused elements aren't completely hidden */
*:focus-visible {
  scroll-margin-top: 100px; /* Sticky header height + buffer */
}

/* Sticky elements should not obscure content */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Main content should have padding for sticky elements */
main {
  padding-top: 80px; /* Match sticky header height */
}
```

**Testing:**
- [ ] Tab through entire page
- [ ] Verify focused element is at least partially visible
- [ ] Test with sticky headers, footers, sidebars
- [ ] Test with modals, toasts, chat widgets
- [ ] Test on mobile with bottom navigation
- [ ] Focused element not entirely covered by any fixed UI

**Common Issues:**
- Cookie banners covering focused elements
- Sticky headers obscuring top-focused items
- Chat widgets covering form inputs
- Bottom tab bars (mobile) covering focused buttons

**Tools:**
- Manual keyboard testing
- Browser DevTools (inspect focus ring position)

---

### 2.5 Input Modalities

#### ✅ 2.5.1 Pointer Gestures (Level A)

**Requirement:** All functionality that uses multipoint or path-based gestures can be operated with a single pointer without a path-based gesture, unless multipoint or path-based gestures are essential.

**Why This Matters:**
Users with motor impairments, tremors, or who use assistive devices may be unable to perform complex gestures like pinch-to-zoom, two-finger swipes, or drawing specific paths.

**Implementation:**
```jsx
// Bad: Pinch-only zoom
function BadImageViewer() {
  const [scale, setScale] = useState(1);

  const handlePinch = (e) => {
    // Only pinch gesture - no alternative
    setScale(e.scale);
  };

  return (
    <img
      src="/photo.jpg"
      onGestureChange={handlePinch}
      style={{ transform: `scale(${scale})` }}
    />
  );
}

// Good: Pinch zoom + single-pointer alternative (buttons)
function GoodImageViewer() {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 1));

  return (
    <div>
      {/* Single-pointer alternatives */}
      <div role="group" aria-label="Zoom controls">
        <button onClick={zoomIn} aria-label="Zoom in">
          +
        </button>
        <button onClick={zoomOut} aria-label="Zoom out">
          -
        </button>
        <button onClick={() => setScale(1)} aria-label="Reset zoom">
          Reset
        </button>
      </div>

      <img
        src="/photo.jpg"
        alt="Product photo"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}

// Good: Two-finger swipe + single-tap alternative
function SwipeableGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />

      {/* Single-pointer alternatives */}
      <button
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        aria-label="Previous image"
      >
        ← Previous
      </button>
      <button
        onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
        disabled={currentIndex === images.length - 1}
        aria-label="Next image"
      >
        Next →
      </button>
    </div>
  );
}

// Good: Path-based gesture with alternative
function SignaturePad() {
  const [signature, setSignature] = useState(null);
  const [useTyped, setUseTyped] = useState(false);

  return (
    <div>
      <div role="radiogroup" aria-label="Signature method">
        <label>
          <input
            type="radio"
            checked={!useTyped}
            onChange={() => setUseTyped(false)}
          />
          Draw signature
        </label>
        <label>
          <input
            type="radio"
            checked={useTyped}
            onChange={() => setUseTyped(true)}
          />
          Type signature
        </label>
      </div>

      {useTyped ? (
        <input
          type="text"
          placeholder="Type your full name"
          aria-label="Typed signature"
        />
      ) : (
        <canvas
          width="400"
          height="200"
          aria-label="Signature drawing pad"
        />
      )}
    </div>
  );
}

// Good: Map with multipoint gestures + alternatives
function InteractiveMap() {
  return (
    <div>
      {/* Multipoint: Pinch to zoom, two-finger pan */}
      <div className="map-container">
        {/* Map component */}
      </div>

      {/* Single-pointer alternatives */}
      <div role="group" aria-label="Map controls">
        <button aria-label="Zoom in">+</button>
        <button aria-label="Zoom out">-</button>
        <button aria-label="Pan left">←</button>
        <button aria-label="Pan right">→</button>
        <button aria-label="Pan up">↑</button>
        <button aria-label="Pan down">↓</button>
      </div>
    </div>
  );
}
```

**Common Multi-point Gestures Requiring Alternatives:**
- Pinch to zoom → Zoom buttons (+/-)
- Two-finger rotate → Rotate buttons (↻/↺)
- Two-finger scroll → Scroll buttons or keyboard arrows
- Three-finger swipe → Navigation buttons

**Common Path-based Gestures Requiring Alternatives:**
- Draw a shape to unlock → PIN code or typed password
- Swipe pattern unlock → Traditional password
- Signature drawing → Typed name or checkbox consent

**Testing:**
- [ ] All pinch zoom has button alternatives
- [ ] All two-finger gestures have single-pointer alternatives
- [ ] All path-based gestures (drawing, swiping patterns) have alternatives
- [ ] Test on touch device using only single finger taps
- [ ] Test with mouse (single clicks only, no dragging if covered by 2.5.7)

**Exceptions:**
- Gesture is essential (e.g., freehand drawing app where drawing IS the purpose)

**Tools:**
- Manual testing on touch devices
- Mouse-only testing
- Switch device testing

---

#### ✅ 2.5.2 Pointer Cancellation (Level A)

**Requirement:** For functionality activated by single pointer:
- **No Down-Event:** The down-event doesn't execute any part of the function
- **Abort or Undo:** Function completes on up-event, and mechanism available to abort before completion or undo after completion
- **Up Reversal:** The up-event reverses any outcome of the down-event
- **Essential:** Completing function on down-event is essential

**Why This Matters:**
Users with motor impairments may accidentally touch/click elements. Triggering actions on down-event (mousedown/touchstart) prevents users from canceling by moving pointer away before releasing.

**Implementation:**
```jsx
// Bad: Activates on mousedown/touchstart
function BadButton() {
  const handleMouseDown = () => {
    // ❌ Triggers immediately on press - can't be cancelled
    deleteAllData();
  };

  return <button onMouseDown={handleMouseDown}>Delete</button>;
}

// Good: Activates on click (mouseup/touchend)
function GoodButton() {
  const handleClick = () => {
    // ✅ Triggers on release - can be cancelled by moving away
    deleteAllData();
  };

  return <button onClick={handleClick}>Delete</button>;
}

// Good: Down-event with abort mechanism
function ButtonWithAbort() {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    // Give user time to abort
    timeoutRef.current = setTimeout(() => {
      deleteAllData();
      setIsPressed(false);
    }, 1000);
  };

  const handleMouseUp = () => {
    // Cancel if released before timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPressed(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      aria-label={isPressed ? 'Hold to delete... Release to cancel' : 'Delete'}
    >
      {isPressed ? 'Deleting...' : 'Hold to Delete'}
    </button>
  );
}

// Good: Confirmation before completing action
function DeleteButton({ onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onDelete();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div role="alertdialog" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Confirm Delete</h2>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={handleConfirm}>Yes, Delete</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    );
  }

  return <button onClick={handleClick}>Delete</button>;
}

// Good: Undo mechanism
function ButtonWithUndo({ onAction }) {
  const [showUndo, setShowUndo] = useState(false);

  const handleClick = () => {
    onAction();
    setShowUndo(true);

    // Hide undo after 5 seconds
    setTimeout(() => setShowUndo(false), 5000);
  };

  const handleUndo = () => {
    undoAction();
    setShowUndo(false);
  };

  return (
    <>
      <button onClick={handleClick}>Delete Item</button>

      {showUndo && (
        <div role="status" aria-live="polite">
          <p>Item deleted.</p>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </>
  );
}

// Essential: Keyboard playing (down-event essential)
function PianoKey({ note }) {
  const playNote = () => {
    // Play sound
    audioContext.play(note);
  };

  const stopNote = () => {
    // Stop sound
    audioContext.stop(note);
  };

  return (
    <button
      onMouseDown={playNote}
      onMouseUp={stopNote}
      onTouchStart={playNote}
      onTouchEnd={stopNote}
      aria-label={`Piano key ${note}`}
    >
      {note}
    </button>
  );
}

// Context menu pattern (down-event opens menu)
function ContextMenuTrigger() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        Right-click for menu
      </div>

      {menuOpen && (
        <div
          role="menu"
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y
          }}
        >
          <button role="menuitem">Copy</button>
          <button role="menuitem">Paste</button>
          <button role="menuitem" onClick={() => setMenuOpen(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
```

**Testing:**
- [ ] All interactive elements trigger on up-event (click) not down-event
- [ ] OR down-event actions have abort mechanism (move pointer away before release)
- [ ] OR destructive actions have undo within reasonable time
- [ ] Test by pressing and holding, then moving away before release
- [ ] Verify action doesn't execute if pointer moved away

**Common Violations:**
- Delete buttons on mousedown
- Navigation on touchstart
- Form submission on mousedown
- Opening links on touchstart

**Acceptable Patterns:**
- Standard buttons (use onClick)
- Links (use href, trigger on up-event)
- Down-event for essential functionality (games, instruments)
- Down-event with prominent undo

**Tools:**
- Manual testing (press and move away before release)
- Touch device testing

---

#### ✅ 2.5.3 Label in Name (Level A)

**Requirement:** For user interface components with labels that include text or images of text, the accessible name contains the visible text.

**Why This Matters:**
Voice control users speak the visible label to activate controls. If the accessible name doesn't match, voice commands won't work.

**Implementation:**
```jsx
// Bad: Visible text doesn't match accessible name
function BadButton() {
  return (
    <button aria-label="Submit form">
      Send {/* Voice users say "Click Send" but accessible name is "Submit form" */}
    </button>
  );
}

// Good: Accessible name includes visible text
function GoodButton() {
  return (
    <button aria-label="Send message">
      Send {/* Accessible name includes "Send" */}
    </button>
  );
}

// Better: Use visible text as accessible name
function BetterButton() {
  return (
    <button>
      Send {/* Accessible name is "Send" - perfect match */}
    </button>
  );
}

// Bad: Icon button with mismatched label
function BadIconButton() {
  return (
    <button aria-label="Remove item">
      <TrashIcon /> {/* Voice users might say "Click delete" or "Click trash" */}
    </button>
  );
}

// Good: Clear relationship between icon and label
function GoodIconButton() {
  return (
    <button aria-label="Delete">
      <TrashIcon />
      Delete {/* Visible text matches accessible name */}
    </button>
  );
}

// Good: Supplemented label
function SearchButton() {
  return (
    <button aria-label="Search for products">
      Search {/* "Search" from visible text is in accessible name */}
    </button>
  );
}

// Bad: Completely different text
function BadLinkText() {
  return (
    <a href="/article" aria-label="View blog post">
      Read More {/* Voice users say "Click read more" but accessible name is different */}
    </a>
  );
}

// Good: Accessible name includes visible text
function GoodLinkText() {
  return (
    <a href="/article" aria-label="Read more about accessibility">
      Read More {/* "Read More" is in accessible name */}
    </a>
  );
}

// Good: Match visible text exactly
function CardLink({ title }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>Article excerpt...</p>
      {/* Accessible name matches visible text */}
      <a href="/article" aria-label={`Read more: ${title}`}>
        Read More
      </a>
    </article>
  );
}

// Good: Form input labels
function FormField() {
  return (
    <div>
      <label htmlFor="email">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        // Accessible name is "Email Address" from <label>
        // Matches visible text ✓
      />
    </div>
  );
}
```

**Rules:**
1. **Accessible name must CONTAIN the visible text** (can have additional text)
2. **Visible text should appear at START of accessible name** (voice control users expect this)
3. **Exact match is best** (use visible text as accessible name when possible)

**Testing:**
- [ ] For each button/link, compare visible text to accessible name
- [ ] Accessible name contains visible text
- [ ] Test with voice control ("Click [visible text]")
- [ ] Use screen reader to hear accessible name
- [ ] Check aria-label, aria-labelledby, and visible text match

**Common Violations:**
- "Read More" button with aria-label="View Article Details"
- "Submit" button with aria-label="Send form to server"
- Search icon with aria-label="Find" (when visible text says "Search")
- Icon + text where aria-label only describes icon

**Tools:**
- Screen reader testing
- Voice control testing (Dragon, Voice Control on Mac/iOS)
- Browser DevTools (inspect accessible name)
- axe DevTools

---

#### ✅ 2.5.4 Motion Actuation (Level A)

**Requirement:** Functionality triggered by device motion (shaking, tilting) or user motion can also be operated by user interface components, and motion can be disabled to prevent accidental actuation (unless motion is essential).

**Why This Matters:**
Users with motor disabilities may be unable to perform or may involuntarily perform motions. Device motion can also be triggered accidentally (phone in pocket, wheelchair vibration).

**Implementation:**
```jsx
// Bad: Shake-only undo
function BadShakeToUndo() {
  useEffect(() => {
    const handleShake = (e) => {
      if (e.accelerationIncludingGravity.x > 15) {
        // ❌ No alternative method
        undoLastAction();
      }
    };

    window.addEventListener('devicemotion', handleShake);
    return () => window.removeEventListener('devicemotion', handleShake);
  }, []);

  return <div>Shake device to undo</div>;
}

// Good: Shake to undo + button alternative + disable option
function GoodShakeToUndo() {
  const [motionEnabled, setMotionEnabled] = useState(
    localStorage.getItem('motionEnabled') === 'true'
  );

  useEffect(() => {
    if (!motionEnabled) return;

    const handleShake = (e) => {
      if (e.accelerationIncludingGravity.x > 15) {
        undoLastAction();
      }
    };

    window.addEventListener('devicemotion', handleShake);
    return () => window.removeEventListener('devicemotion', handleShake);
  }, [motionEnabled]);

  const toggleMotion = () => {
    const newValue = !motionEnabled;
    setMotionEnabled(newValue);
    localStorage.setItem('motionEnabled', String(newValue));
  };

  return (
    <div>
      {/* UI alternative */}
      <button onClick={undoLastAction}>
        Undo
      </button>

      {/* Disable motion */}
      <label>
        <input
          type="checkbox"
          checked={motionEnabled}
          onChange={toggleMotion}
        />
        Enable shake to undo
      </label>

      {motionEnabled && <p>You can also shake device to undo</p>}
    </div>
  );
}

// Good: Tilt to scroll + traditional scroll + disable
function TiltScroll() {
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    if (!tiltEnabled) return;

    const handleOrientation = (e) => {
      const tilt = e.beta; // Front-to-back tilt
      if (tilt > 10) {
        window.scrollBy(0, 5);
      } else if (tilt < -10) {
        window.scrollBy(0, -5);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [tiltEnabled]);

  return (
    <div>
      {/* Traditional scrolling still works */}
      <div style={{ height: '2000px', overflowY: 'scroll' }}>
        Content...
      </div>

      {/* Optional motion feature */}
      <button onClick={() => setTiltEnabled(!tiltEnabled)}>
        {tiltEnabled ? 'Disable' : 'Enable'} Tilt Scrolling
      </button>
    </div>
  );
}

// Good: Motion controls for game with alternatives
function Game() {
  const [useMotion, setUseMotion] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  // Motion controls
  useEffect(() => {
    if (!useMotion) return;

    const handleMotion = (e) => {
      setPlayerPosition({
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y
      });
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [useMotion]);

  // Keyboard controls (alternative)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          setPlayerPosition(prev => ({ ...prev, x: prev.x - 10 }));
          break;
        case 'ArrowRight':
          setPlayerPosition(prev => ({ ...prev, x: prev.x + 10 }));
          break;
        case 'ArrowUp':
          setPlayerPosition(prev => ({ ...prev, y: prev.y - 10 }));
          break;
        case 'ArrowDown':
          setPlayerPosition(prev => ({ ...prev, y: prev.y + 10 }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={useMotion}
            onChange={(e) => setUseMotion(e.target.checked)}
          />
          Use device motion controls
        </label>
        <p>Or use arrow keys</p>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          border: '1px solid black'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: playerPosition.x,
            top: playerPosition.y,
            width: '20px',
            height: '20px',
            background: 'blue'
          }}
        />
      </div>
    </div>
  );
}

// Settings page pattern
function MotionSettings() {
  const [motionEnabled, setMotionEnabled] = useState(false);

  return (
    <fieldset>
      <legend>Motion Controls</legend>

      <label>
        <input
          type="checkbox"
          checked={motionEnabled}
          onChange={(e) => setMotionEnabled(e.target.checked)}
        />
        Enable motion-based controls
      </label>

      <p>
        <small>
          When disabled, all motion-activated features will use button/keyboard
          alternatives instead.
        </small>
      </p>

      {motionEnabled && (
        <p>
          <strong>Note:</strong> You can shake your device to undo, or tilt to scroll.
        </p>
      )}
    </fieldset>
  );
}
```

**Common Motion-Triggered Functions:**
- Shake to undo/redo/refresh
- Tilt to scroll
- Tilt for parallax effects
- Lean closer to zoom
- Raise phone to ear for actions
- Flip phone for different view

**Requirements:**
1. **UI alternative must exist** (button, keyboard, etc.)
2. **Motion can be disabled** (settings toggle)
3. **Motion is opt-in preferred** (not enabled by default)

**Testing:**
- [ ] All motion-triggered functions have UI alternatives
- [ ] Motion can be disabled in settings
- [ ] Test without performing motion gestures
- [ ] Verify accidental motion doesn't trigger functions
- [ ] Check if motion is opt-in or opt-out

**Exceptions:**
- Motion is essential (e.g., pedometer app, motion-controlled game where motion IS the purpose)
- Motion is used for accessibility (e.g., Switch Control, Voice Control)

**Tools:**
- Manual testing (try to use app without motion)
- Device motion simulation in DevTools
- Test with motion disabled

---

#### ✅ 2.5.7 Dragging Movements (Level AA) 🆕 WCAG 2.2

**Requirement:** All functionality that uses dragging can also be achieved by a single pointer (click/tap) without dragging, unless dragging is essential.

**Why This Matters:**
Many users cannot perform precise dragging movements due to motor disabilities, tremors, or using alternative input devices.

**Implementation:**
```jsx
// Bad: Drag-only interface
function BadSortable({ items }) {
  return (
    <div>
      {items.map(item => (
        <div draggable key={item.id}>
          {item.name}
        </div>
      ))}
    </div>
  );
}

// Good: Dragging + alternative keyboard/button controls
function AccessibleSortable({ items, onReorder }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Alternative: Click to select, then click destination
  const handleItemClick = (item, index) => {
    if (!selectedItem) {
      setSelectedItem({ item, index });
    } else {
      // Move selected item to clicked position
      onReorder(selectedItem.index, index);
      setSelectedItem(null);
    }
  };

  // Alternative: Up/down buttons
  const moveUp = (index) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < items.length - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={selectedItem?.index === index ? 'selected' : ''}
          onClick={() => handleItemClick(item, index)}
        >
          <span>{item.name}</span>
          {/* Alternative controls */}
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); moveUp(index); }}
              disabled={index === 0}
              aria-label={`Move ${item.name} up`}
            >
              ↑
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); moveDown(index); }}
              disabled={index === items.length - 1}
              aria-label={`Move ${item.name} down`}
            >
              ↓
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Good: Slider with alternative input
function AccessibleSlider({ value, onChange, min = 0, max = 100 }) {
  return (
    <div>
      {/* Native range input provides keyboard alternative to dragging */}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        aria-label="Adjust value"
      />
      {/* Alternative: Direct number input */}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        aria-label="Enter exact value"
      />
    </div>
  );
}

// Good: Drag-and-drop file upload with click alternative
function FileUpload({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div>
      {/* Drag-and-drop area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFilesSelected(Array.from(e.dataTransfer.files));
        }}
        className={isDragging ? 'dragging' : ''}
      >
        <p>Drag files here</p>
      </div>

      {/* Alternative: Click to browse */}
      <button onClick={() => fileInputRef.current.click()}>
        Or click to browse files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFilesSelected(Array.from(e.target.files))}
      />
    </div>
  );
}
```

**Testing:**
- [ ] All drag-and-drop interactions have click/tap alternatives
- [ ] Sliders can be adjusted with keyboard arrow keys
- [ ] Sortable lists have up/down buttons or keyboard shortcuts
- [ ] File uploads work without dragging
- [ ] Map panning has keyboard/button alternatives
- [ ] Drawing tools have non-drag alternatives (or are marked as essential)

**Exceptions:**
- Drawing/painting applications (dragging is essential)
- Handwriting recognition (dragging is essential)
- Games where dragging is core mechanic

**Tools:**
- Manual testing without mouse/trackpad
- Touch screen testing with single taps only
- Keyboard navigation testing

---

#### ✅ 2.5.8 Target Size (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** Touch/click targets are at least 24x24 CSS pixels, with exceptions:
- **Spacing:** Target is smaller but has enough spacing so the 24x24 target area doesn't overlap another target
- **Inline:** Target is in a sentence or text block
- **User agent control:** Size is determined by browser (like native form controls)
- **Essential:** Particular presentation is essential

**Why This Matters:**
Small touch targets are difficult for users with motor impairments, tremors, or large fingers to activate accurately.

**Implementation:**
```css
/* Minimum target sizes */
button, a, input[type="checkbox"], input[type="radio"] {
  min-width: 24px;
  min-height: 24px;
  /* Or use padding to achieve 24x24 hit area */
}

/* Icon-only buttons */
.icon-button {
  width: 44px; /* Exceeds minimum, better UX */
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Small visual element with larger hit area */
.close-button {
  position: relative;
  width: 16px; /* Visual size */
  height: 16px;
  padding: 12px; /* Creates 40x40 hit area */
}

/* Ensure spacing between small targets */
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin: 4px; /* Spacing ensures 24x24 non-overlapping areas */
  min-height: 24px;
}

/* Checkbox/radio with larger hit area */
input[type="checkbox"], input[type="radio"] {
  width: 24px;
  height: 24px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  /* Entire label is clickable */
}

/* Mobile navigation targets */
.mobile-nav-item {
  min-height: 48px; /* Larger for mobile */
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

/* Pagination links */
.pagination button {
  min-width: 44px;
  min-height: 44px;
  margin: 0 4px;
}
```

**React Implementation:**
```jsx
// Ensure proper target sizing
const IconButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  svg {
    width: 20px; /* Icon smaller than button */
    height: 20px;
  }
`;

// Checkbox with adequate target size
function Checkbox({ label, ...props }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      cursor: 'pointer',
      minHeight: '44px'
    }}>
      <input
        type="checkbox"
        style={{ width: '24px', height: '24px' }}
        {...props}
      />
      <span style={{ marginLeft: '8px' }}>{label}</span>
    </label>
  );
}

// Tags with adequate spacing
function TagList({ tags, onRemove }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags.map(tag => (
        <div key={tag} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 12px',
          minHeight: '32px',
          background: '#e5e7eb',
          borderRadius: '16px'
        }}>
          <span>{tag}</span>
          <button
            onClick={() => onRemove(tag)}
            style={{
              width: '24px',
              height: '24px',
              marginLeft: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Testing:**
- [ ] Measure all interactive elements (DevTools)
- [ ] All standalone targets are ≥ 24x24 CSS pixels
- [ ] OR targets have spacing so 24x24 areas don't overlap
- [ ] Test on touch devices
- [ ] Test with large finger/stylus simulation

**Common Violations:**
- Close buttons (×) too small (common: 16x16)
- Icon-only buttons without padding
- Checkbox/radio inputs without adequate size
- Pagination numbers too small
- Social media icons clustered together

**Tools:**
- Browser DevTools (inspect element dimensions)
- Accessibility Insights for Web
- Touch/pointer simulation

---

## Principle 3: Understandable

### 3.1 Readable

#### ✅ 3.1.1 Language of Page (Level A)

**Requirement:** Default human language of page is programmatically determined.

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

**Testing:**
- [ ] `<html>` tag has `lang` attribute
- [ ] Language code is valid (en, es, fr, etc.)

---

#### ✅ 3.1.2 Language of Parts (Level AA) ⭐

**Requirement:** The human language of each passage or phrase in the content can be programmatically determined, except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text.

**Why This Matters:**
Screen readers need to know when language changes to pronounce words correctly. Mixing languages without marking them causes mispronunciation and confusion for users relying on text-to-speech.

**Implementation:**
```html
<!-- Good: Marking language changes -->
<p>
  The French phrase <span lang="fr">je ne sais quoi</span> is often used in English.
</p>

<p>
  In Germany, you might say <span lang="de">Guten Tag</span> to greet someone.
</p>

<p>
  The Spanish word <span lang="es">mañana</span> means tomorrow.
</p>

<!-- Good: Multilingual quote -->
<blockquote lang="es">
  <p>La vida es bella.</p>
  <footer>— Spanish proverb</footer>
</blockquote>

<!-- Good: Mixed language content -->
<article lang="en">
  <h1>Learning Italian</h1>
  <p>
    Today we'll learn about Italian greetings. The most common greeting is
    <span lang="it">ciao</span>, which means both hello and goodbye.
  </p>

  <p>
    For a more formal greeting, you would say
    <span lang="it">buongiorno</span> (good morning) or
    <span lang="it">buonasera</span> (good evening).
  </p>
</article>
```

**React Implementation:**
```jsx
// Good: Component for foreign phrases
function ForeignPhrase({ text, language, translation }) {
  return (
    <span>
      <span lang={language} style={{ fontStyle: 'italic' }}>
        {text}
      </span>
      {translation && <span> ({translation})</span>}
    </span>
  );
}

// Usage
<p>
  The German word <ForeignPhrase text="Schadenfreude" language="de" translation="pleasure derived from another's misfortune" /> has no direct English equivalent.
</p>

// Good: Multilingual blog post
function BlogPost({ title, content, excerpts }) {
  return (
    <article lang="en">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />

      {/* Quotes in different languages */}
      <section>
        <h2>International Perspectives</h2>

        <blockquote lang="fr">
          <p>L'art est long, la vie est courte.</p>
          <footer>— French saying</footer>
        </blockquote>

        <blockquote lang="ja">
          <p>七転び八起き</p>
          <footer>— Japanese proverb (Fall down seven times, stand up eight)</footer>
        </blockquote>
      </section>
    </article>
  );
}

// Good: Language switcher with proper lang attributes
function MultilingualContent({ contentByLang, currentLang }) {
  return (
    <div>
      <div role="group" aria-label="Language selection">
        <button onClick={() => setLang('en')} aria-pressed={currentLang === 'en'}>
          English
        </button>
        <button onClick={() => setLang('es')} aria-pressed={currentLang === 'es'}>
          Español
        </button>
        <button onClick={() => setLang('fr')} aria-pressed={currentLang === 'fr'}>
          Français
        </button>
      </div>

      <div lang={currentLang}>
        {contentByLang[currentLang]}
      </div>
    </div>
  );
}

// Good: Product names in different languages
function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <span lang={product.nameLanguage}>{product.name}</span>
          {' - '}
          <span>{product.description}</span>
        </li>
      ))}
    </ul>
  );
}

// Example usage
<ProductList
  products={[
    { id: 1, name: 'Café con Leche', nameLanguage: 'es', description: 'Coffee with milk' },
    { id: 2, name: 'Croissant', nameLanguage: 'fr', description: 'Buttery pastry' },
    { id: 3, name: 'Gelato', nameLanguage: 'it', description: 'Italian ice cream' }
  ]}
/>
```

**Common Language Codes:**
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi

**Regional Variants:**
- `en-US` - American English
- `en-GB` - British English
- `es-ES` - Spain Spanish
- `es-MX` - Mexican Spanish
- `fr-FR` - France French
- `fr-CA` - Canadian French
- `pt-BR` - Brazilian Portuguese
- `pt-PT` - European Portuguese
- `zh-CN` - Simplified Chinese
- `zh-TW` - Traditional Chinese

**When NOT to Mark Language:**

**1. Proper Names:**
```html
<!-- No lang attribute needed -->
<p>I met Maria Garcia in Madrid.</p>
<p>The company Tesla was founded by Elon Musk.</p>
```

**2. Technical Terms:**
```html
<!-- No lang attribute needed for technical terms -->
<p>The function uses an AJAX request to fetch data.</p>
<p>Configure the nginx server for HTTPS.</p>
```

**3. Loan Words in Common Use:**
```html
<!-- No lang attribute needed - part of English vocabulary -->
<p>We had pizza and espresso for lunch.</p>
<p>The entrepreneur had a lot of charisma.</p>
```

**4. Indeterminate Language:**
```html
<!-- Brand names, neologisms -->
<p>Download the app from the App Store.</p>
```

**Testing:**
- [ ] Foreign language words/phrases have lang attribute
- [ ] Language codes are valid (ISO 639-1)
- [ ] Quotes in other languages marked with lang
- [ ] Multi-language content properly identified
- [ ] Test with screen reader - verify correct pronunciation
- [ ] Proper names not over-marked
- [ ] Common loan words not marked

**How Screen Readers Use Language:**
```javascript
// Screen reader switches voice/pronunciation based on lang attribute
<p>
  <!-- English voice -->
  The French word
  <!-- Switches to French voice/pronunciation -->
  <span lang="fr">bonjour</span>
  <!-- Back to English voice -->
  means hello.
</p>
```

**Common Issues:**
- Foreign phrases not marked
- Quotes in other languages without lang attribute
- Entire page in wrong language
- Over-marking common loan words
- Forgetting lang on blockquotes

**Testing with Screen Reader:**
```html
<!-- Bad: Mispronounced by English voice -->
<p>In France, you say bonjour</p>

<!-- Good: Correctly pronounced by French voice -->
<p>In France, you say <span lang="fr">bonjour</span></p>
```

**Tools:**
- Screen reader testing (VoiceOver, NVDA, JAWS)
- Browser DevTools (inspect lang attributes)
- W3C HTML Validator (checks for lang attributes)
- Manual inspection

**Best Practices:**
- Mark all foreign language passages
- Use most specific language code when known (en-US vs en)
- Don't over-mark (proper names, common loan words)
- Test with screen reader to verify pronunciation
- Document language changes for content creators

---

### 3.2 Predictable

#### ✅ 3.2.1 On Focus (Level A)

**Requirement:** Focusing on a component doesn't cause unexpected context change.

**Implementation:**
- Don't auto-submit forms on focus
- Don't auto-navigate on focus
- Don't open modals automatically

**Testing:**
- [ ] Tabbing through page doesn't trigger navigation
- [ ] Focus doesn't open modals automatically

---

#### ✅ 3.2.2 On Input (Level A)

**Requirement:** Changing input doesn't cause unexpected context change.

**Implementation:**
- Require user action (button click) to submit
- Don't auto-navigate on select change

**Testing:**
- [ ] Selecting dropdown doesn't auto-navigate
- [ ] Typing doesn't auto-submit forms

---

#### ✅ 3.2.3 Consistent Navigation (Level AA) ⭐

**Requirement:** Navigation mechanisms appear in same order on multiple pages.

**Implementation:**
- Navigation menu stays in same position
- Same order of nav items across all pages

**Testing:**
- [ ] Navigation consistent across all pages
- [ ] Same relative order maintained

---

#### ✅ 3.2.4 Consistent Identification (Level AA) ⭐

**Requirement:** Components that have the same functionality within a set of web pages are identified consistently.

**Why This Matters:**
Users with cognitive disabilities benefit from consistent labels and icons. If a "Download" button is labeled "Download" on one page and "Get File" on another, it creates confusion and increases cognitive load.

**Implementation:**
```jsx
// Bad: Inconsistent button labels for same function
function PageOne() {
  return <button onClick={downloadFile}>Download</button>;
}

function PageTwo() {
  return <button onClick={downloadFile}>Get File</button>; // ❌ Different label
}

// Good: Consistent button labels
function PageOne() {
  return <button onClick={downloadFile}>Download</button>;
}

function PageTwo() {
  return <button onClick={downloadFile}>Download</button>; // ✅ Same label
}

// Bad: Inconsistent icon meanings
function Header() {
  return (
    <nav>
      <button aria-label="Search">🔍</button>
      <button aria-label="Menu">☰</button>
    </nav>
  );
}

function Sidebar() {
  return (
    <div>
      <button aria-label="Search">🔎</button> {/* Different icon */}
      <button aria-label="Navigation">☰</button> {/* Different label */}
    </div>
  );
}

// Good: Consistent icons and labels
const IconButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} aria-label={label}>
    {icon}
  </button>
);

// Reusable icon constants
const ICONS = {
  search: '🔍',
  menu: '☰',
  save: '💾',
  delete: '🗑️',
  edit: '✏️'
};

// Good: Consistent search across pages
function SearchButton() {
  return (
    <button aria-label="Search">
      <SearchIcon />
      Search
    </button>
  );
}

// Use same component everywhere
<Header>
  <SearchButton />
</Header>

<Sidebar>
  <SearchButton />
</Sidebar>

<Footer>
  <SearchButton />
</Footer>

// Good: Consistent save functionality
function SaveButton({ onSave }) {
  return (
    <button onClick={onSave} aria-label="Save">
      <SaveIcon />
      Save
    </button>
  );
}

// Use consistently across forms
<ProfileForm>
  <SaveButton onSave={saveProfile} />
</ProfileForm>

<SettingsForm>
  <SaveButton onSave={saveSettings} />
</SettingsForm>

// Good: Consistent help links
const HelpLink = () => (
  <a href="/help" aria-label="Help documentation">
    <HelpIcon />
    Help
  </a>
);

// Good: Consistent pagination
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}

// Use same pagination component everywhere
<BlogList>
  <Pagination {...paginationProps} />
</BlogList>

<ProductList>
  <Pagination {...paginationProps} />
</ProductList>
```

**Consistency Requirements:**

**1. Text Labels:**
```jsx
// Bad: Inconsistent
<button>Download</button>  // Page 1
<button>Get File</button>  // Page 2

// Good: Consistent
<button>Download</button>  // All pages
```

**2. Icons:**
```jsx
// Bad: Different icons for same function
<button aria-label="Delete"><TrashIcon /></button>  // Page 1
<button aria-label="Delete"><XIcon /></button>      // Page 2

// Good: Same icon for same function
<button aria-label="Delete"><TrashIcon /></button>  // All pages
```

**3. Alternative Text:**
```jsx
// Bad: Inconsistent alt text
<img src="/logo.png" alt="Company Logo" />     // Page 1
<img src="/logo.png" alt="Our Brand" />        // Page 2

// Good: Consistent alt text
<img src="/logo.png" alt="Acme Corporation" /> // All pages
```

**4. Link Text:**
```jsx
// Bad: Inconsistent
<a href="/contact">Contact Us</a>    // Page 1
<a href="/contact">Get in Touch</a>  // Page 2

// Good: Consistent
<a href="/contact">Contact Us</a>    // All pages
```

**Common Patterns to Keep Consistent:**

```jsx
// Create a design system with reusable components
const DesignSystem = {
  // Primary actions
  SaveButton: ({ onClick }) => (
    <button className="btn-primary" onClick={onClick}>
      <SaveIcon /> Save
    </button>
  ),

  CancelButton: ({ onClick }) => (
    <button className="btn-secondary" onClick={onClick}>
      Cancel
    </button>
  ),

  DeleteButton: ({ onClick }) => (
    <button className="btn-danger" onClick={onClick} aria-label="Delete">
      <TrashIcon /> Delete
    </button>
  ),

  // Navigation
  BackButton: ({ onClick }) => (
    <button onClick={onClick} aria-label="Go back">
      ← Back
    </button>
  ),

  // Search
  SearchInput: ({ onSearch }) => (
    <div>
      <input
        type="search"
        placeholder="Search..."
        aria-label="Search"
        onChange={onSearch}
      />
      <button aria-label="Submit search">
        <SearchIcon />
      </button>
    </div>
  ),

  // Social media links
  SocialLinks: () => (
    <div role="group" aria-label="Social media links">
      <a href="https://facebook.com" aria-label="Facebook">
        <FacebookIcon />
      </a>
      <a href="https://twitter.com" aria-label="Twitter">
        <TwitterIcon />
      </a>
    </div>
  )
};
```

**Testing:**
- [ ] Same function has same label across all pages
- [ ] Same icons used for same functions
- [ ] Navigation labels consistent
- [ ] Form buttons consistent (Save, Cancel, Submit)
- [ ] Help links labeled consistently
- [ ] Search functionality labeled consistently
- [ ] Social media links consistent
- [ ] Document download links consistent

**Common Violations:**
- "Download PDF" on one page, "Get PDF" on another
- Save icon differs across forms
- "Search" button vs "Find" button for same function
- Social media icons without consistent labels
- Help icon in different positions with different labels

**Acceptable Variations:**
```jsx
// OK: Same function, more specific context in label
<button aria-label="Save profile">Save</button>
<button aria-label="Save settings">Save</button>

// OK: Same function, additional descriptive text
<button>Download</button>
<button>Download (PDF, 2MB)</button>

// OK: Icon with text vs icon-only (as long as aria-label consistent)
<button aria-label="Edit"><EditIcon /> Edit</button>
<button aria-label="Edit"><EditIcon /></button>
```

**Best Practices:**
- Create reusable components for common actions
- Document standard labels in design system
- Use component libraries (Material-UI, Ant Design)
- Code review for consistency
- Accessibility audit across multiple pages
- User testing to identify confusing inconsistencies

**Tools:**
- Manual inspection across multiple pages
- Design system documentation
- Component storybook
- Accessibility audit tools

---

#### ✅ 3.2.6 Consistent Help (Level A) 🆕 WCAG 2.2

**Requirement:** If a help mechanism (live chat, phone number, email, self-help, contact form) is provided on multiple pages, it appears in the same relative order on each page.

**Why This Matters:**
Users with cognitive disabilities benefit from predictable location of help mechanisms. Finding help shouldn't require re-learning its location on every page.

**Implementation:**
```jsx
// Good: Consistent help placement across all pages
function PageLayout({ children }) {
  return (
    <div>
      <header>
        <nav>
          {/* Main navigation */}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        {/* Help mechanisms in consistent order */}
        <div className="help-section">
          <h2>Need Help?</h2>
          <ul>
            <li><a href="/contact">Contact Form</a></li>
            <li><a href="tel:1-800-555-0100">Call: 1-800-555-0100</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li>
              <button onClick={() => openLiveChat()}>
                Live Chat
              </button>
            </li>
          </ul>
        </div>
        {/* ... other footer content ... */}
      </footer>
    </div>
  );
}

// Or: Floating help button in consistent location
function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',  // Always in same position
      zIndex: 1000
    }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Get help"
          style={{ width: '60px', height: '60px' }}
        >
          ?
        </button>
      ) : (
        <div className="help-menu">
          <button onClick={() => setIsOpen(false)}>Close</button>
          {/* Help options in consistent order */}
          <a href="/contact">Contact Us</a>
          <a href="tel:1-800-555-0100">Call Support</a>
          <a href="/faq">View FAQs</a>
          <button onClick={openLiveChat}>Start Live Chat</button>
        </div>
      )}
    </div>
  );
}

// Good: Help links in consistent header position
function Header() {
  return (
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/about">About</a>
        {/* Help always last in navigation */}
        <a href="/help">Help</a>
      </nav>
    </header>
  );
}
```

**Testing:**
- [ ] Identify all help mechanisms (chat, phone, email, FAQ, contact form)
- [ ] Verify help mechanisms appear in same relative order on all pages
- [ ] Check across different page types (home, product, checkout, account)
- [ ] If help mechanism is in header, it's always in same position
- [ ] If help mechanism is in footer, items appear in same order

**What Counts as Help Mechanism:**
- ✅ Live chat widget
- ✅ Phone numbers for human contact
- ✅ Email addresses for human contact
- ✅ Contact forms reaching humans
- ✅ Self-help options (FAQ, Help Center)
- ❌ Social media links (not direct help)
- ❌ Search (not specifically for help)

**Common Violations:**
- Help link moves from header to footer on different pages
- Phone number appears before live chat on one page, after on another
- FAQ link present on some pages but missing on others (breaking consistency)

**Tools:**
- Manual visual inspection across multiple pages
- Test with users with cognitive disabilities

---

### 3.3 Input Assistance

#### ✅ 3.3.1 Error Identification (Level A)

**Requirement:** If an input error is automatically detected, the item in error is identified and the error is described to the user in text.

**Why This Matters:**
Users need clear, text-based error messages to understand what went wrong and how to fix it. Visual indicators alone (like red borders) are insufficient for blind users, colorblind users, or screen reader users.

**Implementation:**
```jsx
// Bad: Visual-only error indication
function BadForm() {
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setHasError(true); // Only visual indicator - no text description
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ borderColor: hasError ? 'red' : 'gray' }} // ❌ Color only
      />
      <button>Submit</button>
    </form>
  );
}

// Good: Text error message
function GoodForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Email must contain an @ symbol');
    } else {
      setError('');
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && (
        <div id="email-error" role="alert">
          {error}
        </div>
      )}
      <button>Submit</button>
    </form>
  );
}

// Good: Multiple field validation with error summary
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must be a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSubmitted(true);

    if (Object.keys(newErrors).length === 0) {
      // Submit form
      console.log('Form submitted successfully');
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error Summary */}
      {submitted && errorCount > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            There {errorCount === 1 ? 'is' : 'are'} {errorCount} error
            {errorCount === 1 ? '' : 's'} in the form:
          </h2>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Username Field */}
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <div id="username-error" role="alert">
            {errors.username}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <div id="password-error" role="alert">
            {errors.password}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          aria-describedby={
            errors.confirmPassword ? 'confirmPassword-error' : undefined
          }
        />
        {errors.confirmPassword && (
          <div id="confirmPassword-error" role="alert">
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

// Good: Real-time validation
function EmailField() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    if (!value.includes('@')) {
      return 'Email must contain @';
    }
    if (!value.includes('.')) {
      return 'Email must contain a domain';
    }
    return '';
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value));
    }
  };

  return (
    <div>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && (
        <div
          id="email-error"
          role="alert"
          style={{ color: '#ef4444', marginTop: '0.25rem' }}
        >
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}
    </div>
  );
}

// Good: Server-side error handling
function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const data = await response.json();
        // Display server error in text
        setServerError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setServerError('Network error. Please check your connection.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '1rem',
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          <strong>Error:</strong> {serverError}
        </div>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
      </div>

      <button type="submit">Sign In</button>
    </form>
  );
}

// Good: File upload error handling
function FileUpload() {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('File must be JPEG or PNG format');
      return;
    }

    setError('');
    // Process file
  };

  return (
    <div>
      <label htmlFor="file-upload">Upload Image</label>
      <input
        id="file-upload"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'file-error' : undefined}
      />
      {error && (
        <div id="file-error" role="alert" style={{ color: '#ef4444' }}>
          {error}
        </div>
      )}
    </div>
  );
}
```

**Error Message Best Practices:**
1. **Identify the field** - Which field has the error?
2. **Describe the error** - What is wrong?
3. **Suggest a fix** - How to correct it?

**Good Error Messages:**
- ✅ "Email is required"
- ✅ "Password must be at least 8 characters"
- ✅ "Passwords do not match"
- ✅ "File size must be less than 5MB"
- ✅ "Date must be in format MM/DD/YYYY"

**Bad Error Messages:**
- ❌ "Invalid input" (doesn't identify field or explain what's wrong)
- ❌ "Error" (not descriptive)
- ❌ Red border only (not text-based)

**Testing:**
- [ ] All form validation errors display text messages
- [ ] Error messages identify which field has error
- [ ] Error messages describe what is wrong
- [ ] Error messages are associated with fields (aria-describedby)
- [ ] Errors announced by screen readers (role="alert")
- [ ] Test with screen reader to verify errors are announced
- [ ] Visual error indicators (color, icons) supplemented with text
- [ ] Error summary provided for multi-field forms

**ARIA Attributes:**
- `aria-invalid="true"` - Marks field as having error
- `aria-describedby="error-id"` - Associates error message with field
- `role="alert"` - Announces error to screen readers
- `aria-live="assertive"` - For critical errors (form submission failures)

**Common Issues:**
- Color-only error indication (red border without text)
- Icon-only errors (X icon without text explanation)
- Generic error messages ("Invalid input")
- Errors not associated with fields (aria-describedby missing)
- Errors not announced to screen readers
- Error displayed far from the field

**Tools:**
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard navigation (tab through form, trigger errors)
- axe DevTools (checks for error identification)

---

#### ✅ 3.3.2 Labels or Instructions (Level A)

**Requirement:** Labels or instructions provided when content requires user input.

**Implementation:**
```jsx
<label htmlFor="email">
  Email Address <span className="required">*</span>
</label>
<input
  type="email"
  id="email"
  required
  aria-required="true"
  aria-describedby="email-help"
/>
<span id="email-help">We'll never share your email.</span>
```

**Testing:**
- [ ] All form fields have labels
- [ ] Required fields clearly marked
- [ ] Instructions provided for complex inputs

---

#### ✅ 3.3.3 Error Suggestion (Level AA) ⭐

**Requirement:** If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content.

**Why This Matters:**
Users with cognitive disabilities benefit from helpful suggestions on how to fix errors. Simply telling someone "invalid input" isn't helpful. Provide specific guidance on what's wrong and how to fix it.

**Implementation:**
```jsx
// Bad: Generic error without suggestion
function BadEmailValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!value.includes('@')) {
      setError('Invalid email'); // ❌ Not helpful
    }
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); validate(e.target.value); }} />
      {error && <div>{error}</div>}
    </div>
  );
}

// Good: Specific error with suggestion
function GoodEmailValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!value) {
      setError('Email is required. Please enter your email address.');
    } else if (!value.includes('@')) {
      setError('Email must include an @ symbol. Example: user@example.com');
    } else if (!value.includes('.')) {
      setError('Email must include a domain. Example: user@example.com');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); validate(e.target.value); }} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? 'email-error' : undefined} />
      {error && <div id="email-error" role="alert">{error}</div>}
    </div>
  );
}

// Good: Password with specific suggestions
function PasswordFieldWithSuggestions() {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const validatePassword = (value) => {
    const newErrors = [];
    if (value.length < 8) newErrors.push('Password must be at least 8 characters long');
    if (!/[A-Z]/.test(value)) newErrors.push('Include at least one uppercase letter (A-Z)');
    if (!/[a-z]/.test(value)) newErrors.push('Include at least one lowercase letter (a-z)');
    if (!/[0-9]/.test(value)) newErrors.push('Include at least one number (0-9)');
    if (!/[!@#$%^&*]/.test(value)) newErrors.push('Include at least one special character (!@#$%^&*)');
    setErrors(newErrors);
  };

  return (
    <div>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }} aria-describedby="password-requirements" />
      <div id="password-requirements">
        {errors.length > 0 ? (
          <ul role="alert">
            {errors.map((error, index) => (<li key={index} style={{ color: '#dc2626' }}>{error}</li>))}
          </ul>
        ) : (
          <p style={{ color: '#059669' }}>✓ Password meets all requirements</p>
        )}
      </div>
    </div>
  );
}
```

**Error Suggestion Best Practices:**
1. **Be Specific:** "Email must include @ symbol" vs "Invalid input"
2. **Provide Examples:** "Date must be MM/DD/YYYY format. Example: 12/31/2025"
3. **Explain Rules:** "Password must be at least 8 characters and include one uppercase letter"
4. **Offer Alternatives:** "PDF not supported. Upload JPEG, PNG, or GIF instead"

**Testing:**
- [ ] All error messages include suggestions for correction
- [ ] Suggestions are specific and actionable
- [ ] Examples provided where helpful
- [ ] Error messages explain what's wrong AND how to fix it

**Security Exception:**
- Don't suggest valid usernames
- Don't provide specific password hints that aid attackers
- Don't reveal which part of authentication failed

---

#### ✅ 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA) ⭐

**Requirement:** For web pages that cause legal commitments or financial transactions, or that modify/delete user data, at least one of the following is true:
- **Reversible:** Submissions are reversible
- **Checked:** Data is checked for errors and user can correct them
- **Confirmed:** User can review, confirm, and correct before finalizing

**Why This Matters:**
Mistakes in legal, financial, or data operations can have serious consequences. Users need a way to review and confirm before committing to irreversible actions.

**Implementation:**

**Pattern 1: Confirmation Dialog**
```jsx
// Good: Confirm before deletion
function DeleteButton({ item, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div role="alertdialog" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Confirm Deletion</h2>
        <p>Are you sure you want to delete "{item.name}"? This cannot be undone.</p>
        <button onClick={() => { onDelete(item.id); setShowConfirm(false); }}>Yes, Delete</button>
        <button onClick={() => setShowConfirm(false)}>Cancel</button>
      </div>
    );
  }

  return <button onClick={() => setShowConfirm(true)}>Delete</button>;
}

// Good: Review before purchase
function CheckoutFlow() {
  const [step, setStep] = useState('cart');

  return (
    <div>
      {step === 'cart' && <ShoppingCart onContinue={() => setStep('review')} />}
      {step === 'review' && <OrderReview onEdit={() => setStep('cart')} onConfirm={() => setStep('confirm')} />}
      {step === 'confirm' && <OrderConfirmation />}
    </div>
  );
}

function OrderReview({ cart, onEdit, onConfirm }) {
  return (
    <div>
      <h2>Review Your Order</h2>
      <section>
        <h3>Items</h3>
        <ul>
          {cart.items.map(item => (<li key={item.id}>{item.name} - ${item.price} × {item.quantity}</li>))}
        </ul>
      </section>
      <section><h3>Total</h3><p><strong>${cart.total}</strong></p></section>
      <button onClick={onEdit}>Edit Order</button>
      <button onClick={onConfirm}>Confirm and Place Order</button>
    </div>
  );
}
```

**Pattern 2: Undo Mechanism**
```jsx
// Good: Undo for data modification
function EmailWithUndo({ email, onDelete }) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    setDeleted(true);
    setTimeout(() => { if (deleted) onDelete(email.id); }, 5000);
  };

  if (deleted) {
    return (
      <div role="status">
        <p>Email deleted.</p>
        <button onClick={() => setDeleted(false)}>Undo</button>
      </div>
    );
  }

  return (
    <div>
      <p>{email.subject}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

**When This Applies:**
- **Legal commitments:** Contracts, agreements, binding submissions
- **Financial transactions:** Purchases, transfers, payments, donations
- **Data modification:** Deleting user data, modifying profile, canceling subscriptions

**Testing:**
- [ ] Financial transactions have confirmation step
- [ ] Data deletion has confirmation dialog
- [ ] Users can edit information before final submission
- [ ] OR undo mechanism provided for irreversible actions
- [ ] Confirmation can be canceled

---

#### ✅ 3.3.7 Redundant Entry (Level A) 🆕 WCAG 2.2

**Requirement:** Information previously entered by the user is either:
- Auto-populated
- Available for the user to select
- UNLESS re-entering is essential, required for security, or previous information is no longer valid

**Why This Matters:**
Users with cognitive disabilities or motor impairments benefit from not having to re-enter the same information multiple times. Reduces errors and cognitive load.

**Implementation:**
```jsx
// Good: Auto-populate from previous step
function CheckoutShipping({ billingAddress }) {
  const [shippingAddress, setShippingAddress] = useState(billingAddress);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={(e) => {
            setSameAsBilling(e.target.checked);
            if (e.target.checked) {
              setShippingAddress(billingAddress);
            }
          }}
        />
        Shipping address same as billing
      </label>

      {!sameAsBilling && (
        <div>
          <input
            value={shippingAddress.street}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, street: e.target.value })
            }
            placeholder="Street"
          />
          {/* Other address fields */}
        </div>
      )}
    </form>
  );
}

// Good: Remember user's selections with localStorage
function ContactForm() {
  const [formData, setFormData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('contactFormDraft');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '' };
  });

  useEffect(() => {
    // Save draft as user types
    localStorage.setItem('contactFormDraft', JSON.stringify(formData));
  }, [formData]);

  return (
    <form>
      <label>
        Name:
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </label>
      {/* ... */}
    </form>
  );
}

// Good: Use browser autocomplete
function PaymentForm() {
  return (
    <form>
      <label htmlFor="cc-name">Cardholder Name</label>
      <input
        id="cc-name"
        name="cc-name"
        type="text"
        autocomplete="cc-name"
      />

      <label htmlFor="cc-number">Card Number</label>
      <input
        id="cc-number"
        name="cc-number"
        type="text"
        autocomplete="cc-number"
      />

      <label htmlFor="cc-exp">Expiration Date</label>
      <input
        id="cc-exp"
        name="cc-exp"
        type="text"
        autocomplete="cc-exp"
      />
    </form>
  );
}

// Good: Provide selection from previous entries
function RecipientForm({ previousRecipients }) {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);

  return (
    <div>
      {!manualEntry && previousRecipients.length > 0 && (
        <div>
          <label htmlFor="select-recipient">
            Select from previous recipients:
          </label>
          <select
            id="select-recipient"
            onChange={(e) => {
              const recipient = previousRecipients.find(
                (r) => r.id === e.target.value
              );
              setSelectedRecipient(recipient);
            }}
          >
            <option value="">-- Select --</option>
            {previousRecipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name} ({recipient.email})
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setManualEntry(true)}>
            Or enter new recipient
          </button>
        </div>
      )}

      {(manualEntry || previousRecipients.length === 0) && (
        <div>
          <input placeholder="Name" />
          <input placeholder="Email" type="email" />
        </div>
      )}
    </div>
  );
}
```

**Testing:**
- [ ] Multi-step forms don't require re-entering same information
- [ ] Billing/shipping address offers "same as" option
- [ ] Forms use appropriate autocomplete attributes
- [ ] User can select from previously entered values
- [ ] Session data persists across pages (where appropriate)

**Exceptions:**
- **Essential:** Re-entering password to confirm
- **Security:** Re-entering credentials for sensitive actions
- **Invalid:** Previous data is no longer valid (e.g., expired)

**Common Violations:**
- Multi-step forms requiring same address on each step
- Profile update forms not pre-populating current values
- Search forms not remembering recent searches
- Not offering "same as billing" option for shipping

**Tools:**
- Manual testing through multi-step processes
- Test with saved browser autocomplete data

---

#### ✅ 3.3.8 Accessible Authentication (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** Authentication does not rely on a cognitive function test (like remembering a password or solving a puzzle) UNLESS:
- An alternative method is provided that doesn't require a cognitive test
- A mechanism is available to assist (password manager, copy-paste)
- The cognitive test is recognizing objects
- The cognitive test is identifying non-text content provided by the user

**Why This Matters:**
Traditional password entry and CAPTCHAs create barriers for users with cognitive disabilities, memory impairments, or language barriers.

**Implementation:**
```jsx
// Good: Password with paste enabled + password manager support
function LoginForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"  // Enables password managers
        // DO NOT disable paste!
      />

      <button type="submit">Sign In</button>

      {/* Alternative: Email magic link */}
      <button
        type="button"
        onClick={sendMagicLink}
      >
        Or email me a sign-in link
      </button>
    </form>
  );
}

// Good: Biometric authentication alternative
function SecureLogin() {
  const [method, setMethod] = useState('password');

  return (
    <div>
      <div>
        <button onClick={() => setMethod('password')}>
          Password
        </button>
        <button onClick={() => setMethod('biometric')}>
          Face ID / Touch ID
        </button>
        <button onClick={() => setMethod('sms')}>
          SMS Code
        </button>
      </div>

      {method === 'password' && (
        <input
          type="password"
          autoComplete="current-password"
        />
      )}

      {method === 'biometric' && (
        <button onClick={authenticateWithBiometric}>
          Use Face ID / Touch ID
        </button>
      )}

      {method === 'sms' && (
        <div>
          <p>We'll text a code to your phone: ***-***-1234</p>
          <input
            type="text"
            placeholder="Enter code"
            autoComplete="one-time-code"
          />
        </div>
      )}
    </div>
  );
}

// Good: Object recognition CAPTCHA (acceptable)
function ObjectCaptcha() {
  return (
    <div>
      <p>Select all images containing a traffic light:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => toggleSelection(image.id)}
          >
            <img src={image.src} alt="" role="presentation" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Bad: Text-based CAPTCHA without alternative
function BadCaptcha() {
  return (
    <div>
      <img src="/captcha/distorted-text.png" alt="CAPTCHA" />
      <input placeholder="Enter the text above" />
      {/* No alternative provided - FAILS */}
    </div>
  );
}

// Good: CAPTCHA with alternative
function AccessibleCaptcha() {
  const [method, setMethod] = useState('visual');

  return (
    <div>
      {method === 'visual' && (
        <>
          <img src="/captcha/objects.png" alt="Select all traffic lights" />
          <div>{/* Object selection interface */}</div>
        </>
      )}

      {method === 'audio' && (
        <>
          <audio controls src="/captcha/audio-challenge.mp3" />
          <input placeholder="Enter what you heard" />
        </>
      )}

      <button onClick={() => setMethod(method === 'visual' ? 'audio' : 'visual')}>
        Switch to {method === 'visual' ? 'audio' : 'visual'} challenge
      </button>
    </div>
  );
}

// Good: WebAuthn / Passkeys (no cognitive test)
async function registerPasskey() {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(/* ... */),
        rp: { name: "Your App" },
        user: {
          id: new Uint8Array(/* ... */),
          name: "user@example.com",
          displayName: "User Name"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }]
      }
    });
    // Store credential
  } catch (err) {
    console.error('Passkey registration failed', err);
  }
}
```

**Acceptable Authentication Methods:**
✅ Biometric (Face ID, Touch ID, fingerprint)
✅ Hardware tokens (YubiKey)
✅ SMS/email one-time codes (with copy-paste)
✅ OAuth/SSO (Sign in with Google, etc.)
✅ Magic links (email sign-in links)
✅ Password managers (with autocomplete enabled)
✅ WebAuthn / Passkeys
✅ Object recognition (select all traffic lights)
✅ Personal content recognition (your uploaded photo)

❌ Text-based CAPTCHA only
❌ Math problems
❌ Memory tests (without password manager support)
❌ Password without paste enabled
❌ Complex password rules preventing password managers

**Testing:**
- [ ] Password fields allow paste
- [ ] Password fields use `autoComplete="current-password"`
- [ ] Alternative auth method available (biometric, magic link, SMS)
- [ ] OR password manager can save/fill credentials
- [ ] CAPTCHA uses object recognition or has alternatives
- [ ] No text transcription required without alternative

**Tools:**
- Test with password manager (1Password, LastPass, built-in)
- Test paste functionality
- Try authentication without typing

---

## Principle 4: Robust

### 4.1 Compatible

#### ✅ 4.1.1 Parsing (Level A)

**Requirement:** HTML is well-formed (proper opening/closing tags, unique IDs, etc.)

**Implementation:**
- Use valid HTML5
- Validate with W3C validator

**Testing:**
- [ ] Run HTML validator
- [ ] No duplicate IDs
- [ ] All tags properly closed

**Tools:**
- W3C HTML Validator: https://validator.w3.org/

---

#### ✅ 4.1.2 Name, Role, Value (Level A)

**Requirement:** All UI components have accessible name and role.

**Implementation:**
```jsx
// Built-in HTML elements (role is implicit)
<button>Click me</button> {/* role="button" implicit */}
<a href="...">Link</a> {/* role="link" implicit */}

// Custom components need explicit ARIA
<div
  role="button"
  aria-label="Close menu"
  aria-pressed="false"
  tabIndex={0}
>
  ×
</div>
```

**Testing:**
- [ ] All buttons have accessible names
- [ ] All links have text or aria-label
- [ ] Custom components have proper ARIA roles
- [ ] State changes communicated (aria-expanded, aria-pressed)

**Tools:**
- axe DevTools
- Screen reader testing

---

#### ✅ 4.1.3 Status Messages (Level AA) ⭐

**Requirement:** Status messages can be programmatically determined through role or properties so they can be presented to the user by assistive technologies without receiving focus.

**Why This Matters:**
Screen reader users need to know when important status changes occur (form submission success, errors, loading states, search results) without interrupting their current task or having to hunt for the message.

**Implementation:**
```jsx
// Good: Success message with aria-live
function FormSuccessMessage({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: '1rem',
        background: '#d1fae5',
        border: '1px solid #10b981',
        borderRadius: '0.5rem',
      }}
    >
      {message}
    </div>
  );
}

// Good: Error message with alert role
function ErrorAlert({ message }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        padding: '1rem',
        background: '#fee2e2',
        border: '1px solid #ef4444',
        borderRadius: '0.5rem',
      }}
    >
      <strong>Error:</strong> {message}
    </div>
  );
}

// Good: Loading state
function LoadingStatus({ isLoading }) {
  return isLoading ? (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <span aria-hidden="true">Loading...</span>
    </div>
  ) : null;
}

// Good: Search results status
function SearchResults({ query, resultCount, isLoading }) {
  return (
    <div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? (
          `Searching for "${query}"...`
        ) : (
          `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} for "${query}"`
        )}
      </div>
      {/* Results list */}
    </div>
  );
}

// Good: Form validation status
function FormField({ label, value, onChange, error }) {
  const [touched, setTouched] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={touched && error ? 'true' : 'false'}
        aria-describedby={touched && error ? errorId : undefined}
      />
      {touched && error && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          style={{ color: '#ef4444', marginTop: '0.25rem' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Good: Cart update notification
function AddToCartButton({ product, onAdd }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <button onClick={handleAdd}>Add to Cart</button>
      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: '0.5rem',
            color: '#10b981',
          }}
        >
          ✓ {product.name} added to cart
        </div>
      )}
    </>
  );
}

// Good: Progress indicator
function UploadProgress({ progress }) {
  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Upload progress"
        style={{
          width: '100%',
          height: '20px',
          background: '#e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#6366f1',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        Upload {progress}% complete
      </div>
    </div>
  );
}

// Good: Live region for dynamic content
function LiveFeed() {
  const [messages, setMessages] = useState([]);

  return (
    <div>
      <h2>Live Updates</h2>
      <div
        role="log"
        aria-live="polite"
        aria-atomic="false"
        style={{
          maxHeight: '400px',
          overflow: 'auto',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
    </div>
  );
}

// Bad: Status message without ARIA
function BadStatusMessage({ message }) {
  return (
    <div className="success-message">
      {/* No role or aria-live - screen readers won't announce */}
      {message}
    </div>
  );
}

// Bad: Moving focus to status message
function BadErrorHandling({ error }) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      // Don't do this! Interrupts user's current task
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <div ref={errorRef} tabIndex={-1}>
      {error}
    </div>
  );
}
```

**ARIA Live Regions:**
```html
<!-- role="status" - for non-critical info -->
<div role="status" aria-live="polite">
  Your changes have been saved.
</div>

<!-- role="alert" - for important/urgent messages -->
<div role="alert" aria-live="assertive">
  Error: Unable to save your changes.
</div>

<!-- role="log" - for sequential updates -->
<div role="log" aria-live="polite" aria-atomic="false">
  New message received...
</div>

<!-- role="progressbar" - for progress indicators -->
<div
  role="progressbar"
  aria-valuenow="45"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Download progress"
>
  45% complete
</div>
```

**aria-live Values:**
- `off` - Updates not announced (default)
- `polite` - Announced when user is idle (most common)
- `assertive` - Announced immediately (use sparingly, for errors/alerts)

**aria-atomic Values:**
- `true` - Entire region announced (for complete status messages)
- `false` - Only changed content announced (for logs, feeds)

**Common Status Messages:**
1. **Form submission results**
   - "Form submitted successfully"
   - "Error: Please fix the highlighted fields"

2. **Search/filter results**
   - "Showing 24 results for 'laptop'"
   - "No results found"

3. **Loading states**
   - "Loading content..."
   - "Saving changes..."

4. **Item updates**
   - "Item added to cart"
   - "Bookmark saved"

5. **Progress indicators**
   - "Upload 45% complete"
   - "Step 2 of 5"

**Testing:**
- [ ] All status messages have role="status", role="alert", or aria-live
- [ ] Screen reader announces status changes without moving focus
- [ ] Success messages use role="status" or aria-live="polite"
- [ ] Errors use role="alert" or aria-live="assertive"
- [ ] Test with VoiceOver (macOS), NVDA (Windows), or JAWS
- [ ] Verify messages are announced at appropriate time
- [ ] Verify focus remains in current location
- [ ] Test loading states are announced
- [ ] Test form validation messages are announced

**Common Violations:**
- Status messages without role or aria-live
- Moving focus to status messages (interrupts user)
- Using aria-live="assertive" for non-urgent messages
- Announcements too frequent (overwhelming)
- Status messages that appear/disappear too quickly
- Missing aria-atomic when entire message should be announced

**Exceptions:**
- Changes that require user action (should move focus)
- Page titles (announced automatically)
- Dialog/modal openings (should move focus)

**Tools:**
- Screen reader testing (VoiceOver, NVDA, JAWS)
- Browser DevTools (inspect ARIA attributes)
- axe DevTools (checks for appropriate roles)

**Best Practices:**
- Use `role="status"` for non-critical updates (saves, confirmations)
- Use `role="alert"` for errors and urgent messages
- Use `aria-atomic="true"` for complete status messages
- Keep messages concise and clear
- Don't overuse aria-live (too many announcements are overwhelming)
- Test the timing - messages shouldn't appear/disappear too quickly
- Ensure visual and programmatic status match

---

## Testing Checklist

### Automated Testing (Run on every build)

- [ ] **ESLint** with jsx-a11y plugin
- [ ] **Playwright** with axe-core
- [ ] **Lighthouse** accessibility audit (95+ score)

### Manual Testing (Before release)

- [ ] **Keyboard navigation** - Tab through all pages
- [ ] **Screen reader** - Test with VoiceOver/NVDA/JAWS
- [ ] **Color contrast** - Verify all ratios
- [ ] **Zoom to 200%** - Verify no content loss
- [ ] **Resize to 320px** - Verify no horizontal scroll
- [ ] **Reduced motion** - Test with OS setting enabled

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Tools & Resources

### Free Testing Tools

1. **Chrome DevTools Lighthouse** - Built-in accessibility audit
2. **axe DevTools Extension** - Automated testing
3. **WAVE Extension** - Visual accessibility evaluation
4. **WebAIM Contrast Checker** - Color contrast testing
5. **Screen Readers:**
   - macOS: VoiceOver (Cmd+F5)
   - Windows: NVDA (free download)
   - Linux: Orca

### Reference Documentation

- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- WebAIM Articles: https://webaim.org/articles/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

## Compliance Statement Template

```
This website is committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone and applying the relevant
accessibility standards.

Conformance Status: Fully Conformant
Standards: WCAG 2.2 Level AA

Date: [Month Year]
Last Reviewed: [Month Year]
```

---

**Last Updated:** October 2025
**Version:** WCAG 2.2 (October 2023)
