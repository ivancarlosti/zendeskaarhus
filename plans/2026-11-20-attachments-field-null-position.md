# Render the attachments field when `position_in_portal` is null

## Context

Upstream `zendesk/copenhagen_theme@766d7cf619` ("fix: render attachments field
when position_in_portal is null") fixes a service catalog item whose attachment
option has no portal position configured: the attachments field silently
disappeared from the request form.

This fork reads the position from the nested Custom Object record shape
(`attachmentsOption.custom_object_fields["standard::position_in_portal"]`)
instead of the flat `attachmentsOption.position_in_portal` used upstream, but
the defect is the same. In `ItemRequestForm.renderRequestFields()` both
insertion points require `typeof attachmentsPosition === "number"`, so a
`null` position rendered the field nowhere. When the option is required,
`useValidateServiceItemForm` blocks submission with an error the user cannot
act on, because no attachment field is on screen.

## Goal

Render the attachments field at the end of the form when
`standard::position_in_portal` is `null`/missing, keeping the configured
position behaviour untouched.

## Steps

1. `ItemRequestForm.tsx`: fall back to `requestFields.length` when the
   position is nullish. That value can never equal an index inside
   `requestFields.forEach` (0..length-1), so the existing trailing
   `attachmentsPosition >= requestFields.length` branch appends the field once,
   at the end.
2. `data-types/Attachments.ts`: type `standard::position_in_portal` as
   `number | null`, matching the API's nullable numeric field.
3. Add `ItemRequestForm.spec.tsx` covering the regression (null position →
   last child), the configured position (0 → first child) and no attachment
   option (field absent), reusing `src/modules/test/render.tsx`.

## Risks

- Behaviour change by design: items with a null position now show the
  attachments field (previously nothing was rendered).
- A null position with `standard::is_required = true` still validates, so the
  user must upload a file before submitting — the error is now actionable.
- No dependency, API or build changes; render-only logic.
