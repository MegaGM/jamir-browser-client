<template>
  <div class="component">
    <div class="content">
      <a-row>
        <a-col :span="24">
          <h2>Exported Reports</h2>
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
export default class ExportedReports extends Vue { }
</script>
