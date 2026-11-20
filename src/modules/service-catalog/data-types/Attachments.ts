export interface AttachmentsOptionResponse {
  custom_object_record: AttachmentsOption;
}

export interface AttachmentsOption {
  url: string;
  id: string;
  name: string;
  custom_object_key: "standard::service_catalog_attachment_option";
  custom_object_fields: CustomObjectFields;
  created_by_user_id: string;
  updated_by_user_id: string;
  created_at: string;
  updated_at: string;
  external_id: string | null;
  photo: unknown | null;
}

export interface CustomObjectFields {
  "standard::brand_id": number;
  "standard::description": string | null;
  "standard::is_required": boolean;
  // Null when no position has been configured for the attachment option.
  "standard::position_in_portal": number | null;
}

export type AttachmentsError = string | null;
