<template>
  <lil-upload-content v-bind="uploadContentProps">
    <slot></slot>
  </lil-upload-content>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { UploadContentProps } from './upload-content'
import { UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload'
import LilUploadContent from './upload-content.vue'

defineOptions({
  name: 'lil-upload'
})
const props = defineProps(uploadProps)
const emits = defineEmits({})
const uploadFiles = ref<UploadFiles>(props.FileList)
const uploadContentProps = computed<UploadContentProps>(() => {
  return {
    ...props,
    onStart: (rawFile: UploadRawFile) => {
      // 构建内置的文件上传对象
      const uploadFile = {
        uid: rawFile.uid,
        name: rawFile.name,
        percentage: 0,
        raw: rawFile,
        size: rawFile.size,
        status: 'start'
      } as UploadFile
      uploadFile.url = URL.createObjectURL(rawFile)
      uploadFiles.value = [...uploadFiles.value, uploadFile]
      props.onChange(uploadFile)
    },
    onProgress: (e, rawFile) => {
      const uploadFile = findFile(rawFile)!
      uploadFile.status = 'uploading'
      uploadFile.percentage = e.percent
      props.onProgress(e, uploadFile, uploadFiles.value)
    },
    onRemove: async rawFile => {
      const uploadFile = findFile(rawFile)!
      const r = await props.beforeRemove(uploadFile, uploadFiles.value)
      if (r != false) {
        const fileList = uploadFiles.value
        fileList.splice(fileList.indexOf(uploadFile), 1)
        props.onRemove(uploadFile)
      }
    },
    onError: (err, rawFile) => {
      const uploadFile = findFile(rawFile)!
      uploadFile.status = 'error'
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(uploadFile), 1)
      props.onError(err, uploadFile, fileList)
    },
    onSuccess: (res, rawFile) => {
      const uploadFile = findFile(rawFile)!
      uploadFile.status = 'success'
      const fileList = uploadFiles.value
      props.onSuccess(res, uploadFile, fileList)
    }
  }
})

function findFile(file: UploadFile) {
  return uploadFiles.value.find(item => item.uid === file.uid)
}

watch(uploadFiles, (newUploadFiles: UploadFiles) => {
  emits('update:FileList', newUploadFiles)
})
</script>
