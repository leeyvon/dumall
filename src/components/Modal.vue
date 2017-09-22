<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
            <slot name="title"></slot>
          <button class="md-close" @click="closeModal">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      props:[
         'mdShow'
      ],
      methods:{
          closeModal(){
              this.$emit('close')
          }
      }
  }
</script>
