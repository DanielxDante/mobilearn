export default interface Participant {
    is_admin: boolean;
    participant_email: string;
    participant_id: number;
    participant_name: string;
    participant_profile_picture_url: string | null;
    participant_type: string;
  }