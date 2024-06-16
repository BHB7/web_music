<script setup>
import { useWyUserStore } from '@/stores'
import { NumberOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/formatTime'
const wyUserStore = useWyUserStore()
// const route = useRoute()
const props = defineProps({
  list: {
    type: Object,
    default: () => ({})
  }
})
// tag默认选中
const activeKey = ref('1')
onMounted(() => {
  console.log(props.list)
})
const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags'
  },
  {
    title: 'Action',
    key: 'action'
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
</script>
<template>
  <main class="main">
    <header class="header">
      <!-- 用户头像 -->
      <div class="user-avatar">
        <img :src="props?.list.coverImgUrl" alt="" />
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="user-name r">我喜欢的音乐</div>
        <div class="user-create r">
          <!-- 头像 -->
          <div class="avatar">
            <img :src="props?.list.creator?.avatarUrl" alt="" />
          </div>
          <!-- 昵称 -->
          <div class="nickname">{{ props?.list.creator?.nickname }}</div>
          <!-- 创建时间 -->
          <div class="create-time">{{ formatDate(props.list.createTime) }} 创建</div>
        </div>
        <div class="user-level-desc r">简介：</div>
      </div>
    </header>
    <!-- 内容 -->
    <section class="content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="歌曲">
          <div class="play-list">
            <a-table :columns="columns" :data-source="data" :pagination="false">
              <template #headerCell="{ column }">
                <template v-if="column.key === 'name'">
                  <span>
                    <NumberOutlined />
                    <span class="title">标题</span>
                  </span>
                </template>
              </template>

              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  <a>
                    {{ record.name }}
                  </a>
                </template>
                <template v-else-if="column.key === 'tags'">
                  <span>
                    <a-tag
                      v-for="tag in record.tags"
                      :key="tag"
                      :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
                    >
                      {{ tag.toUpperCase() }}
                    </a-tag>
                  </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <span>
                    <a>Invite 一 {{ record.name }}</a>
                    <a-divider type="vertical" />
                    <a>Delete</a>
                    <a-divider type="vertical" />
                    <a class="ant-dropdown-link">
                      More actions
                      <!-- <down-outlined /> -->
                    </a>
                  </span>
                </template>
              </template>
            </a-table>
          </div>
          <h2>我收藏的歌单</h2>
          <div class="play-list">a</div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="评论" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="播客">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  .header {
    display: flex;
    align-items: center;
    padding: 20px;
    .user-avatar {
      width: 160px;
      height: 160px;
      border-radius: 12px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: space-between;
      .user-create {
        display: flex;
        align-items: center;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .nickname {
          margin: 0 10px;
        }
        .create-time {
          color: #999;
        }
      }
      .r {
        margin-bottom: 10px;
      }
      .user-name {
        font-size: 20px;
        font-weight: 700;
        margin: 10px 0;
        .edit-icon {
          cursor: pointer;
          font-size: 20px;
          color: #999;
        }
      }
    }
  }
  // 内容
  .content {
    height: 100vh;
    .play-list {
      width: 100%;
      // height: 100%;
      margin: 10px 0;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      // 每个歌单
      .item {
        margin-right: 20px;
        margin-top: 20px;
      }
    }
  }
}
</style>
