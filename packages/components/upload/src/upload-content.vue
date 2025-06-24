<template>
  <div :class="bem.b()" @click="handleClick">
    <template v-if="drag">
      <lil-upload-dragger @file="handleUploadFiles">
        <slot></slot>
      </lil-upload-dragger>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <input
      type="file"
      ref="inputRef"
      :name="name"
      :accept="accept"
      multiple
      @change="handleChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { createNamespace } from '@lil-ui/utils/createClassName'
import LilUploadDragger from './upload-dragger.vue'
import { UploadRawFile } from './upload'
import { uploadContentProps } from './upload-content'
import { httpRequest } from './ajax'

defineOptions({
  name: 'lil-upload-content',
  inheritAttrs: false
})
const bem = createNamespace('upload')
const props = defineProps(uploadContentProps)
const inputRef = ref<HTMLInputElement>()
async function upload(rawFile: UploadRawFile) {
  inputRef.value!.value = ''
  const beforeResult = await props.beforeUpload(rawFile)
  if (!beforeResult) {
    return props.onRemove(rawFile)
  }
  const { method, name, action, headers, data } = props
  httpRequest({
    method,
    name,
    file: rawFile,
    action,
    headers,
    data,
    onError: e => {
      props.onError(e, rawFile)
    },
    onSuccess: res => {
      props.onSuccess(res, rawFile)
    },
    onProgress: e => {
      props.onProgress(e, rawFile)
    }
  })
}
function handleUploadFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = uuidv4()
    props.onStart(rawFile)
    upload(rawFile)
  }
}
function handleChange(e: Event) {
  const files = (e.target as HTMLInputElement).files!
  handleUploadFiles(files)
}

const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value!.click()
}
</script>
