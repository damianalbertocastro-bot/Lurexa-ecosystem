# Accessibility Standards

Version: 1.0

Status: Approved

Owner: UX Engineering

Last Updated: 2026-07-28

---

# Purpose

This document defines the accessibility standards for every product, application, website, and mobile experience within the Lurexa ecosystem.

Accessibility is a product requirement.

Every learner should be able to successfully use Lurexa regardless of:

- Visual ability
- Hearing ability
- Motor ability
- Cognitive ability
- Language proficiency
- Device limitations

Accessibility is part of quality—not an optional enhancement.

---

# Standard

Lurexa follows:

- WCAG 2.2 Level AA
- WAI-ARIA Authoring Practices
- HTML Living Standard
- Material Design Accessibility Guidelines (when applicable)

Accessibility is mandatory for all public interfaces.

---

# Accessibility Principles

Every interface should be:

- Perceivable
- Operable
- Understandable
- Robust

These four principles guide every UI decision.

---

# Semantic HTML

Always use semantic elements before ARIA.

Preferred:

```
<header>
<nav>
<main>
<section>
<article>
<footer>
<button>
<label>
```

Avoid:

```
<div onclick="">
```

when a semantic element exists.

---

# Keyboard Navigation

Every interactive feature must be fully usable without a mouse.

Verify:

- Tab navigation
- Shift + Tab
- Enter
- Space
- Escape
- Arrow keys where appropriate

Users should never become trapped in keyboard navigation.

---

# Focus Management

Interactive elements must display a visible focus indicator.

Do not remove:

```
outline
```

without providing an accessible replacement.

Focus should move logically after:

- Dialogs
- Navigation
- Form submission
- Dynamic content updates

---

# Screen Reader Support

Verify compatibility with:

- NVDA
- VoiceOver
- TalkBack

Every interactive control should have an accessible name.

Example:

```
<button aria-label="Start Lesson">
```

Avoid ambiguous labels such as:

```
Click here

Read more

Open
```

---

# Color and Contrast

Minimum contrast ratios:

Normal text

4.5:1

Large text

3:1

UI components

3:1

Do not rely solely on color to communicate meaning.

Incorrect:

Green = correct

Red = incorrect

Also include:

- Icons
- Text
- Patterns

---

# Typography

Minimum font size:

16px

Preferred line height:

1.5

Avoid:

- Fully justified paragraphs
- Long line lengths
- Decorative fonts for body text

Reading comfort is a learning feature.

---

# Forms

Every form must include:

- Labels
- Validation messages
- Instructions
- Error recovery
- Keyboard support

Errors should explain:

- What happened
- Why it happened
- How to fix it

Example:

Good

```
Password must contain at least 8 characters.
```

Bad

```
Invalid input.
```

---

# Buttons

Buttons should:

- Clearly describe their action
- Be large enough for touch interaction
- Provide hover, focus, active, and disabled states

Avoid generic labels:

```
OK

Go

Submit
```

Prefer:

```
Start Lesson

Save Progress

Enroll Now
```

---

# Links

Links should make sense out of context.

Avoid:

```
Click here
```

Prefer:

```
Read the Lesson Overview
```

---

# Images

Every meaningful image requires alternative text.

Decorative images:

```
alt=""
```

Informative images:

Describe the educational purpose rather than the appearance.

---

# Icons

Icons alone are insufficient.

Always pair important icons with:

- Text
- Tooltip
- Accessible label

---

# Audio

Provide:

- Captions
- Transcripts
- Playback controls

Users must control:

- Volume
- Playback speed
- Pause
- Resume

---

# Video

Educational videos should provide:

- Captions
- Transcript
- Pause
- Seek controls

Future:

- Multiple language subtitles

---

# Motion

Respect:

```
prefers-reduced-motion
```

Animations should:

- Never flash
- Never trigger vestibular discomfort
- Never be required to complete a task

---

# Timing

Avoid strict time limits.

When timing is necessary:

Allow:

- Pause
- Extend
- Resume

---

# Responsive Design

Accessibility applies to every screen size.

Verify:

- Mobile
- Tablet
- Desktop

Touch targets:

Minimum:

44 × 44 pixels

---

# AI Features

AI-generated content must also be accessible.

Verify:

- Readable language
- Proper heading structure
- Keyboard-accessible chat
- Screen-reader-friendly responses

Streaming AI responses should announce updates appropriately.

---

# Learning Content

Lessons should:

- Use headings correctly
- Break long text into sections
- Include summaries
- Support different learning styles

Avoid walls of text.

---

# Error Prevention

Critical actions should support:

- Confirmation
- Undo
- Recovery

Examples:

- Delete lesson
- Cancel subscription
- Remove student

---

# Accessibility Testing

Every feature should be tested using:

Automated:

- axe
- Lighthouse

Manual:

- Keyboard navigation
- Screen reader
- Mobile devices
- High zoom levels

Automated testing alone is insufficient.

---

# Browser Zoom

Applications must remain usable at:

200% zoom

without losing functionality.

---

# Language

Every page should specify:

```
lang="en"
```

or the appropriate locale.

Future multilingual support should update language attributes dynamically.

---

# Cognitive Accessibility

Prefer:

- Plain language
- Consistent navigation
- Predictable interactions
- Progressive disclosure

Reduce unnecessary cognitive load.

---

# Accessibility Checklist

Before merging:

- [ ] Keyboard navigation verified
- [ ] Focus states visible
- [ ] Semantic HTML used
- [ ] Screen reader tested
- [ ] Color contrast passes WCAG AA
- [ ] Images include alt text
- [ ] Forms are fully labeled
- [ ] Error messages are descriptive
- [ ] Videos include captions
- [ ] Responsive layouts verified
- [ ] AI interfaces accessible
- [ ] Automated accessibility tests pass

---

# Continuous Monitoring

Accessibility should be reviewed during:

- Design reviews
- Pull requests
- QA testing
- Major releases

Accessibility regressions are treated as quality defects.

---

# Related Documents

- Coding Standards.md
- Testing Strategy.md
- Performance Standards.md
- Design Tokens.md
- UI Component Library.md
- Pull Request Checklist.md

---

# Guiding Principle

Accessibility is not about meeting a checklist.

It is about ensuring that every learner has an equal opportunity to succeed.

Inclusive design creates better software for everyone.