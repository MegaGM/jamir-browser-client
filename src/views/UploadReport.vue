<template>
  <a-locale-provider :locale="locale">
    <div class="component">
      <div class="controls">
        <a-row>
          <a-col :span="7"></a-col>
          <a-col :span="5">
            <a-input placeholder="Address Program ID" v-model="addressProgramId">
              <a-icon slot="prefix" type="folder-open" />
            </a-input>
          </a-col>
          <a-col :span="5">
            <a-input placeholder="Row ID" v-model="rowId">
              <a-icon slot="prefix" type="idcard" />
            </a-input>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-upload
              :beforeUpload="beforeFileUpload"
              :showUploadList="false"
              :multiple="true"
              accept=".png, .jpg, .jpeg, .gif"
            >
              <a-button>
                <a-icon :type="file.name ? 'picture' : 'upload'" />
                {{file.name ? file.name : 'Выбрать фотографию'}}
              </a-button>
            </a-upload>
            <a-button
              type="primary"
              @click="uploadReport"
              :disabled="!files.length"
              :loading="isUploading"
            >{{isUploading ? 'Идёт загрузка' : 'Загрузить Отчёт' }}</a-button>

            <a-button type="danger" @click="deleteReport">Удалить Отчёт</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-locale-provider>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'

@Component({})
export default class AdressPrograms extends Vue {
  file: any = {}
  files: Array<any> = []
  isUploading = false
  addressProgramId: string = '5dcf91748cb1c659e6046e2a'
  rowId: string = '5dcf91748cb1c659e6046e2c'

  @Getter('locale') locale!: object

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange(newVal: any) {
  }

  beforeFileUpload(file: object) {
    this.files = [...this.files, file]
    return false
  }

  async uploadReport() {
    try {
      this.isUploading = true

      const convertedFiles = await Promise.all(this.files.map(async (file) => ({
        name: file.name,
        base64: await convertFileToBase64(file),
      })))

      const options = {
        files: convertedFiles,
        addressProgramId: this.addressProgramId,
        rowId: this.rowId,
      }

      this.$socket.emit('uploadReport', options, (err: any, data: any) => {
        this.isUploading = false
        if (err) {
          this.$message.error(`Ошибка загрузки! ${err.message}`, 30)
        } else {
          this.file = {}
          this.$message.success('Загрузка завершена', 5)
        }
      })
    } catch (err) {
      this.$message.error(`Ошибка загрузки! ${err.message}`, 30)
    }
  }

  async deleteReport() {
    const options = {
      addressProgramId: this.addressProgramId,
      rowId: this.rowId,
    }

    this.$socket.emit('deleteReport', options, (err: any, data: any) => {
      if (err) {
        this.$message.error(`Ошибка удаления! ${err.message}`, 30)
      } else {
        this.$message.success('Удаление успешно', 5)
      }
    })
  }
}

function convertFileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = (err) => {
      reject(err)
    }
  })
}

</script>

<style scoped>
</style>