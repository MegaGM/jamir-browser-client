<template>
  <div class="component">
    <div class="content">
      <a-row>
        <a-col :span="24">
          <h2>View Reports</h2>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
  },
})
export default class ViewReports extends Vue { }
</script>
