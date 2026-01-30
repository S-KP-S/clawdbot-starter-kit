---
description: A helper skill to create new skills by prompting for metadata and instructions.
---
# Skill Builder

This skill assists in creating new skills for the Antigravity system.

## Workflow

Follow these steps to create a new skill:

1.  **Gather Information**:
    *   Ask the user for the **Skill Name**. Suggest they use `kebab-case` (e.g., `web-scraper`, `data-analyzer`).
    *   Ask for a **Description** (a short summary of what the skill does).
    *   Ask for the **Instructions**. The user can provide the raw markdown content OR a description of what they want the skill to do, which you should then format into clear steps.

2.  **Draft the Content**:
    *   Construct the file content for `SKILL.md` using the standard YAML frontmatter format:
        ```markdown
        ---
        description: [Description provided by user]
        ---
        # [Human Readable Name based on Skill Name]

        [Instructions provided by user]
        ```

3.  **Confirm with User**:
    *   Present the proposed file path: `skills/[skill_name]/SKILL.md`.
    *   Present the proposed content.
    *   Ask for confirmation to proceed.

4.  **Create the Skill**:
    *   If the user approves, use the `write_to_file` tool to create the file.
    *   Ensure the parent directory `skills/[skill_name]` is created (the tool handles this, but verify the path is correct).

5.  **Finalize**:
    *   Inform the user the skill has been created and is ready to use.
