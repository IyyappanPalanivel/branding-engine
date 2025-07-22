export default interface BrandingOptions {
  videoFile: File;
  logoFile: File;
  customerName: string;
  customerRole: string;
  brandColor: string;
  nameTextColor: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoSize: 'small' | 'medium' | 'large';
  setProgressValue: (value: number) => void;
}
