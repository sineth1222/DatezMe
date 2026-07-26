export interface InvitationDraft {
  invitationerName: string;
  coverPhotoUrl: string;
  introMessage: string;
  musicUrl: string;
  offeredVibes: string[];
  selectedDateSpots: string[];
  secretMessage: string;
  memoryPhotos: string[];
}

export const emptyDraft: InvitationDraft = {
  invitationerName: "",
  coverPhotoUrl: "",
  introMessage: "",
  musicUrl: "",
  offeredVibes: [],
  selectedDateSpots: [],
  secretMessage: "",
  memoryPhotos: [],
};

export interface InvitationRecord {
  id: string;
  slug: string;
  invitationer_name: string;
  cover_photo_url: string | null;
  intro_message: string | null;
  music_url: string | null;
  vibe_options: string[];
  date_spot_presets: string[];
  secret_message: string | null;
  memory_photos: string[];
  status: "sent" | "opened" | "accepted";
}
