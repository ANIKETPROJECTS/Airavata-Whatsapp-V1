# Fix Prompt: Add Sample Values for Template Variables

Paste this into Replit.

---

## The Problem

On the **Add Template** page, when a variable like `{{1}}` is inserted into the Body (or Header/Footer) text, Meta's WhatsApp API requires a **sample value** for every variable before the template can be submitted for approval (e.g., for `{{1}}` in "Hi {{1}}, welcome to our service!", Meta needs an example like "Rahul" so it can preview and review the template properly). Right now the form has no way to input these sample values, which may be why templates are stuck in "Pending" or getting rejected.

## What to Build

1. **Detect variables automatically.** Whenever `{{1}}`, `{{2}}`, `{{3}}`, etc. appear in the Body, Header (if type is Text), or Footer fields, automatically detect each unique variable number.

2. **Show a "Sample Values" section** that dynamically updates as variables are added or removed from the text. For each detected variable (e.g., `{{1}}`, `{{2}}`), show a labeled input field like:
   - "Sample value for {{1}}" → text input (e.g., placeholder: "e.g., Rahul")
   - "Sample value for {{2}}" → text input (e.g., placeholder: "e.g., 12345")
   
   These should appear directly below the Body field (or in a clearly separated "Sample Values" card), and update live if the person adds more variables or removes existing ones from the text.

3. **Validation before submission.** Before allowing "Submit for Approval" to be clicked, check that every detected variable has a non-empty sample value filled in. If any are missing, show a clear inline error (e.g., "Please provide a sample value for {{2}}") and prevent submission until fixed.

4. **Update the live preview.** The message preview panel on the right should substitute each `{{n}}` with its entered sample value in real time, so the preview looks like the actual message a customer would see (e.g., "Hi Rahul, welcome to our service!" instead of "Hi {{1}}, welcome to our service!").

5. **Send sample values to the API correctly.** When the template is submitted, make sure these sample values are included in the correct format required by Meta's template creation API (as part of the component's `example` field, matching however this project's backend already structures the API request to Meta) — not just stored for the local preview.

6. **Apply the same logic to header variables** if the header type is "Text" and contains a variable, and to button variables if any buttons use dynamic URLs with variables.

## What NOT to Change

- Don't change the overall layout or design of the Add Template page beyond adding this Sample Values section.
- Don't change how templates that don't use variables work — this should only appear when at least one variable is detected in the text.
- Don't touch any other page or module.

## After This Is Done

Let me create a new test template with a variable and sample value, submit it, and confirm it either gets approved or shows a clearer rejection reason from Meta (instead of getting stuck).
