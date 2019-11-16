<template>
  <a-locale-provider :locale="locale">
    <div class="component">
      <div class="controls">
        <a-row>
          <a-col :span="24">
            <a-upload
              :beforeUpload="beforeFileUpload"
              :showUploadList="false"
              :multiple="false"
              accept=".xls, .xlsx, .txt, .jpg"
            >
              <a-button>
                <a-icon type="upload" />Выбрать *.xlsx файл
              </a-button>
            </a-upload>
            <a-button
              type="primary"
              @click="uploadAddressProgram"
              :disabled="!file.size"
              :loading="isUploading"
            >{{isUploading ? 'Идёт загрузка' : 'Загрузить Адресную Программу' }}</a-button>
          </a-col>
        </a-row>
      </div>

      <div class="content">
        <a-row>
          <a-col :span="24">
            <a-table
              :columns="columns"
              :dataSource="addressPrograms"
              :pagination="pagination"
              :rowKey="record => record._id"
              @change="handleTableChange"
              bordered
            >
              <template slot="humanReadableTimestamp-slot" slot-scope="text, record, index">
                <div>{{text}}</div>
              </template>
              <template slot="title-slot" slot-scope="text, record, index">
                <div>
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => updateTitleVuex({_id: record._id, title: e.target.value})"
                  />
                  <template v-else>{{text}}</template>
                </div>
              </template>
              <template slot="totalRowCount-slot" slot-scope="text, record, index">
                <div>{{text}}</div>
              </template>
              <template slot="actions-slot" slot-scope="text, record, index">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => updateTitle(record._id)">Сохранить</a>
                    <a @click="() => cancelEditRow(record._id, 'cancel')">Отменить</a>
                  </span>
                  <span v-else>
                    <a @click="() => editRow(record._id)">Редактировать</a>
                    <a-popconfirm
                      title="Уверены, что хотите удалить АП?"
                      @confirm="() => deleteRow(record._id)"
                    >
                      <a>Удалить</a>
                    </a-popconfirm>
                  </span>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-locale-provider>
</template>

<script lang="ts">
const columns = [
  {
    title: 'Дата загрузки',
    dataIndex: 'humanReadableTimestamp',
    width: '17%',
    scopedSlots: { customRender: 'humanReadableTimestamp-slot' },
  },
  {
    title: 'Название',
    dataIndex: 'title',
    scopedSlots: { customRender: 'title-slot' },
  },
  {
    title: 'Кол-во строк',
    dataIndex: 'totalRowCount',
    width: '11%',
    scopedSlots: { customRender: 'totalRowCount-slot' },
  },
  {
    title: 'Действия',
    dataIndex: 'actions',
    width: '15%',
    scopedSlots: { customRender: 'actions-slot' },
  },
]

const pagination: any = {
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number, range: Array<number>) => {
    console.info('showTotal', total, range)
    return `${range[0]}-${range[1]} из ${total}`
  },
}

import { Component, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import AddressProgram from '../types/AddressProgram'

@Component({})
export default class AdressPrograms extends Vue {
  file: any = {}
  isUploading = false
  columns = columns
  pagination = pagination
  filters = {}
  sorter = {}

  @Getter('locale') locale!: object
  @Getter('addressProgramsCount') addressProgramsCount!: number
  @Getter('addressPrograms') addressPrograms!: Array<AddressProgram>
  @Action('getAddressPrograms') getAddressPrograms!: (payload?: object) => void

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    this.setupListeners()
    this.reloadAddressPrograms()
  }

  setupListeners() {
    const channel = this.$socket.channel('reloadAddressPrograms')
    if (!channel.isSubscribed()) {
      channel.subscribe()
      channel.unwatch(this.reloadAddressPrograms)
      channel.watch(this.reloadAddressPrograms)
    }
  }

  async reloadAddressPrograms(options?: object) {
    if (!options) {
      options = { pagination: this.pagination, filters: this.filters, sorter: this.sorter }
    }
    await this.getAddressPrograms(options)
    this.pagination.total = this.addressProgramsCount

    const { total, current, pageSize } = this.pagination
    const shouldSwitchPage = (current - 1) * pageSize >= total
    if (shouldSwitchPage) {
      this.pagination.current = (current - 1)
      await this.reloadAddressPrograms()
    }
  }

  handleTableChange(pagination: any, filters: object, sorter: object) {
    this.pagination = pagination
    this.filters = filters
    this.sorter = sorter
    this.reloadAddressPrograms({ pagination, filters, sorter })
  }

  beforeFileUpload(file: object) {
    this.file = file
    return false
  }

  async uploadAddressProgram() {
    try {
      this.isUploading = true
      const file = await convertFileToBase64(this.file)

      this.$socket.emit('uploadAddressProgram', { file, title: this.file.name }, (err: any, data: any) => {
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

  editRow(_id: string) {
    this.$store.commit('toggleAddressProgramEditableVuex', { _id, editable: true })
  }

  cancelEditRow(_id: string, cancel?: 'cancel') {
    this.$store.commit('toggleAddressProgramEditableVuex', { _id, editable: false, cancel })
  }

  updateTitleVuex(payload: { _id: string, title: string }) {
    this.$store.commit('updateAddressProgramTitleVuex', payload)
  }

  async updateTitle(_id: string) {
    await this.$store.dispatch('updateAddressProgramTitle', _id)
    this.cancelEditRow(_id)
  }

  async deleteRow(_id: string) {
    await this.$store.dispatch('deleteAddressProgram', _id)
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
.editable-row-operations a {
  margin-right: 8px;
}
</style>