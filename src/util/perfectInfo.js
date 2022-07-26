import Vue from 'vue'
import perfectInfo from '@/components/perfectInfo/index.vue'
const perfectInfoBox = Vue.extend(perfectInfo)
perfectInfo.install = function (data) {
  let instance = new perfectInfoBox({data})
  instance.$store = this.$root.$store
  instance.$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.init()
  })
}

export default perfectInfo
