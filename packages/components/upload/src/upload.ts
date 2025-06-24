import { ExtractPropTypes, PropType } from 'vue'

export interface UploadFile {
  uid?: string
  name: string
  url?: string
  percentage?: number
  raw?: File
  size?: number
  status?: string
}

export type UploadFiles = UploadFile[]

export const baseProps = {
  multiple: {
    type: Boolean,
    default: false
  },
  drag: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'file'
  },
  accept: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: 'POST'
  },

  FileList: {
    type: Array as PropType<UploadFiles>,
    default: () => []
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
}

export type UploadRawFile = File & { uid: string }
export type UploadProgressEvent = ProgressEvent & { percent: number }
const NOOP = () => {}
export const uploadProps = {
  ...baseProps,
  onPreview: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeUpload: {
    type: Function as PropType<
      (file: UploadRawFile) => boolean | Promise<boolean>
    >,
    default: NOOP
  },
  onChange: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeRemove: {
    type: Function as PropType<
      (file: UploadFile, uploadFiles: UploadFiles) => Promise<boolean> | boolean
    >,
    default: NOOP
  },
  onProgress: {
    type: Function as PropType<
      (
        file: UploadProgressEvent,
        uploadFile: UploadFile,
        uploadFiles: UploadFiles
      ) => void
    >,
    default: NOOP
  },
  onSuccess: {
    type: Function as PropType<
      (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  },
  onError: {
    type: Function as PropType<
      (err: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  }
} as const 

export type UploadProps = ExtractPropTypes<typeof uploadProps>
