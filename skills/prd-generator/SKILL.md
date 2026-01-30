---
description: Interviews the user to gather detailed requirements and generates a comprehensive Product Requirements Document (PRD).
---
# PRD Generator

This skill guides the agent to create a super detailed PRD for a new project by interviewing the user.

## Workflow

1.  **Kickoff**: Ask the user for a high-level description of the project if they haven't provided one yet.
2.  **Interview Phase**: Conduct a detailed interview to flush out requirements. **Do not ask all questions at once.** Ask 2-3 focused questions at a time. Iterate until you have deep clarity on:
    *   **Problem & Goal**: What are we solving and why?
    *   **Target Audience**: Who is this for?
    *   **Features (MVP vs Future)**: What *must* be in V1?
    *   **User Experience**: How should it feel? What are the key flows?
    *   **Technical Constraints**: Specific stack, platforms, or integrations?
3.  **Synthesize & Confirm**: Summarize your understanding back to the user. Ask if anything is missing.
4.  **Generate PRD**: Create a `PRD.md` artifact containing:
    *   **Executive Summary**
    *   **app flow**
    *   **User Personas & Stories**
    *   **Functional Requirements** (Detailed)
    *   **Non-Functional Requirements** (Performance, Security)
    *   **Technical Architecture** (Suggested stack, data model)
    *   **Milestones**
