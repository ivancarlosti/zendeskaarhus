import { screen } from "@testing-library/react";
import { render } from "../../../test/render";
import { ItemRequestForm } from "./ItemRequestForm";
import type { TicketFieldObject } from "../../../ticket-fields/data-types/TicketFieldObject";
import type { ServiceCatalogItem } from "../../data-types/ServiceCatalogItem";
import type { AttachmentsOption } from "../../data-types/Attachments";

jest.mock("react-i18next", () => ({
  // `src/modules/test/render.tsx` boots i18next and registers this plugin, so
  // the mock has to expose it as well.
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock("../../../ticket-fields", () => ({
  RequestFormField: ({ field }: { field: TicketFieldObject }) => (
    <div data-testid={`request-field-${field.id}`} />
  ),
}));

jest.mock("../../../ticket-fields/fields/attachments/Attachments", () => ({
  Attachments: ({ field }: { field: { label: string } }) => (
    <div data-testid="attachments-field">{field.label}</div>
  ),
}));

jest.mock("../change-user-modal/index", () => ({
  ChangeUserModal: () => null,
}));

describe("ItemRequestForm", () => {
  const serviceCatalogItem: ServiceCatalogItem = {
    id: 1,
    name: "Test Item",
    description: "Test Description",
    form_id: 9848565352189,
    thumbnail_url: "",
    categories: [],
    is_request_on_behalf: false,
    published_at: "2025-01-01T00:00:00Z",
    custom_object_fields: {
      "standard::asset_option": "",
      "standard::asset_type_option": "",
      "standard::attachment_option": "attachment-option-1",
    },
  };

  const requestFields: TicketFieldObject[] = [
    {
      id: 1,
      name: "custom_fields_1",
      type: "text",
      description: "Field 1",
      label: "Field 1",
      required: false,
      options: [],
      value: null,
      error: null,
    },
  ];

  // Mirrors the Custom Object record shape returned by the API: the position
  // lives inside `custom_object_fields` and is null until an admin sets it.
  const createAttachmentsOption = (
    position: number | null
  ): AttachmentsOption => ({
    url: "https://example.com/api/v2/custom_objects/standard::service_catalog_attachment_option/records/attachment-option-1",
    id: "attachment-option-1",
    name: "Attachment Option",
    custom_object_key: "standard::service_catalog_attachment_option",
    custom_object_fields: {
      "standard::brand_id": 1,
      "standard::description": null,
      "standard::is_required": true,
      "standard::position_in_portal": position,
    },
    created_by_user_id: "user-1",
    updated_by_user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    external_id: null,
    photo: null,
  });

  const defaultProps: Parameters<typeof ItemRequestForm>[0] = {
    requestFields,
    serviceCatalogItem,
    baseLocale: "en-us",
    hasAtMentions: false,
    userRole: "end_user",
    requesterId: 123,
    requestOnBehalfEnabled: false,
    userName: "Test User",
    selectedUser: null,
    setSelectedUser: jest.fn(),
    brandId: 456,
    defaultOrganizationId: null,
    handleChange: jest.fn(),
    onSubmit: jest.fn(),
    attachmentsOption: undefined,
    attachmentsRequiredError: null,
    setAttachmentsRequiredError: jest.fn(),
    isRequestFieldsLoading: false,
    isLoadingAttachmentsOption: false,
    assetTypeError: null,
    assetError: null,
    assetTypeHiddenValue: "",
    isAssetTypeHidden: false,
    assetTypeIds: [],
    assetIds: [],
    onAttachmentUploadingChange: jest.fn(),
    isFormInitializing: false,
  };

  const renderForm = (
    props: Partial<Parameters<typeof ItemRequestForm>[0]> = {}
  ) => {
    render(<ItemRequestForm {...defaultProps} {...props} />);

    const attachmentsField = screen.getByTestId("attachments-field");

    return {
      attachmentsField,
      fieldsContainer: attachmentsField.parentElement as HTMLElement,
    };
  };

  it("renders the attachments field at the end when position_in_portal is null", () => {
    const { attachmentsField, fieldsContainer } = renderForm({
      attachmentsOption: createAttachmentsOption(null),
    });

    expect(attachmentsField).toBeInTheDocument();
    expect(fieldsContainer.lastChild).toBe(attachmentsField);
  });

  it("renders the attachments field at its position when position_in_portal is set", () => {
    const { attachmentsField, fieldsContainer } = renderForm({
      attachmentsOption: createAttachmentsOption(0),
    });

    expect(attachmentsField).toBeInTheDocument();
    expect(fieldsContainer.firstChild).toBe(attachmentsField);
    expect(screen.getByTestId("request-field-1")).toBeInTheDocument();
  });

  it("does not render the attachments field without an attachment option", () => {
    render(<ItemRequestForm {...defaultProps} />);

    expect(screen.queryByTestId("attachments-field")).not.toBeInTheDocument();
  });
});
