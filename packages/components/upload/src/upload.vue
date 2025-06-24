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
    onProgress: () => {},
    onRemove: () => {},
    onError: () => {},
    onSuccess: () => {}
  }
})

function findFile(file: UploadFile) {
  return uploadFiles.value.find(item => item.uid === file.uid)
}

watch(uploadFiles, (newValue: any) => {
  console.log(newValue, 'newValue')
})
</script>
