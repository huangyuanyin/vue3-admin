<script setup>
import Editor from '@tinymce/tinymce-vue'
import { defineProps, defineEmits, toRefs, ref, watch, onMounted } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  bodyStyle: {
    type: String,
    default: 'body { margin: 3rem 20% 3rem 6% }'
  },
  plugins: {
    type: [String, Array],
    default:
      ' quickbars        help autosave  lists advlist code charmap link fullscreen emoticons wordcount image codesample   directionality autosave  visualblocks autolink  anchor    importcss insertdatetime media pagebreak  preview searchreplace table '
  },
  toolbar: {
    type: [String, Array],
    default: [
      '    undo redo removeformat  blocks fontsize bold italic strikethrough underline superscript subscript  forecolor backcolor align bullist numlist  lineheight  link blockquote hr searchreplace anchor help  tableofcontentsupdate  charmap emoticons wordcount  code  codesample toc image fullscreen   preview autolink  autosave'
    ]
  }
})

const { modelValue } = toRefs(props)
const editorValue = ref(props.modelValue)
const key = '3wvx4jkjmreyeiqypzs5hnwrkncklep4xi69inkwgfoipxj7'
const initOptions = ref({
  // skin: 'jam', //果酱图标
  // icons: 'jam', //果酱图标
  placeholder: '直接输入正文...',
  // language: 'zh-Hans',
  height: '800px',
  plugins: props.plugins, // 插件
  toolbar: props.readonly ? false : props.toolbar, // 工具栏
  toolbar_mode: 'sliding', // 工具栏模式
  autosave_ask_before_unload: false,
  autosave_interval: '2s', // 编辑器在拍摄当前内容的快照和将其保存到本地存储之间应等待的时间。默认为“ 30s”
  autosave_prefix: 'tinymce-autosave', // 用于保存的键的前缀
  block_formats: '正文=p; 标题1=h1; 标题2=h2; 标题3=h3; 标题4=h4; 标题5=h5; 标题6=h6', // 设置块格式,
  line_height_formats: '1 1.2 1.4 1.6 2 2.5 3', // 设置行高格式
  readonly: props.readonly, // 设置只读
  statusbar: true, // 是否隐藏状态栏
  menubar: false, // 是否隐藏菜单栏
  branding: false, // 是否隐藏品牌
  resize: props.resize, // 是否允许调整大小
  help_accessibility: true, // 是否在 TinyMCE 状态栏中显示用于访问“帮助”对话框的键盘快捷键。
  a11y_advanced_options: true, // 是否在“插入链接”对话框中显示高级选项
  content_style: props.bodyStyle,
  file_picker_callback: (cb) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.addEventListener('change', (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const id = 'blobid' + new Date().getTime()
        const blobCache = tinymce.activeEditor.editorUpload.blobCache
        const base64 = reader.result.split(',')[1]
        const blobInfo = blobCache.create(id, file, base64)
        blobCache.add(blobInfo)
        cb(blobInfo.blobUri(), { title: file.name })
      })
      reader.readAsDataURL(file)
    })
    input.click()
  },
  help_tabs: [
    'shortcuts',
    'keyboardnav'
    //  'plugins', 'versions'
  ], // 设置帮助选项卡
  image_advtab: true, // 是否显示高级选项卡
  image_dimensions: true, // 是否显示图像尺寸
  image_description: true, // 是否显示图像描述
  image_caption: true, // 是否显示图像标题
  image_title: true, // 是否显示图像标题
  image_class_list: [
    { title: '无', value: '' },
    { title: '居中', value: 'img-center' },
    { title: '左浮动', value: 'img-left' },
    { title: '右浮动', value: 'img-right' }
  ], // 设置图像类列表
  file_picker_types: 'image', // 设置文件选择器类型
  quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions', // 快速图像工具栏
  quickbars_selection_toolbar: 'bold italic underline quicklink h2 h3 blockquote quickimage quicktable', // 快速工具栏
  quickbars_insert_toolbar: 'p h2 h3 bullist numlist quickimage quicktable hr', // 快速插入工具栏
  setup: (editor) => {
    editor.on('init', () => {
      //
    })
    // editor.ui.registry.addContextToolbar('paragraphlink', {
    //   predicate: (node) => {
    //     return node.nodeName.toLowerCase() === 'p'
    //   },
    //   items: 'quicklink bold',
    //   position: 'node'
    // })
  }
})

watch(
  () => editorValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { immediate: true }
)

onMounted(() => {
  setTimeout(() => {
    editorValue.value = props.modelValue
  }, 1000)
})
</script>

<template>
  <main id="sample">
    <Editor :disabled="props.readonly" v-model="editorValue" :api-key="key" :init="initOptions"></Editor>
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  #sample {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 100%;
  }
}
</style>
