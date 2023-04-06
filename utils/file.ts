const imageTypes = ['png', 'jpg', 'jpeg'];
const audioTypes = ['mp3', 'ogg', 'webm'];
const docTypes = ['pdf', 'word'];

export const imageLoader = ({src, width}) => {
  return `${src}?w=${width}`;
}

export const getFileSizeMB = (size: number, precision: number | false = 2): number | string => {
  if (!precision) {
    return (size / 1000 / 1000);
  }

  return (size / 1000 / 1000).toFixed(precision as number);
};

export const getFile = (path: string, disk = 's3') => {
  const trimPath = path.startsWith('/') ? path.replace('/', '') : path;

  return `${process.env.NEXT_PUBLIC_API_URL}/get-files/${disk}/${trimPath}`;
}

export const checkType = (file: File, types: Array<string>): boolean => {
  const extension: string = file.name.split('.').pop() as string;
  const loweredTypes = types.map((type) => type.toLowerCase());
  return loweredTypes.includes(extension.toLowerCase());
};

export const acceptedExt = (types: Array<string> | undefined) => {
  if (types === undefined) return '';
  return types.map((type) => `.${type.toLowerCase()}`).join(',');
};

export function isImage(ext: string) {
  return imageTypes.includes(ext);
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function isDoc(ext: string) {
  return docTypes.indexOf(ext);
}

export function isAudio(ext: string) {
  return audioTypes.includes(ext)
}