<template>
  <div class="changePassword">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
          <BackIcon height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          {{ name }}认证
        </Col>
      </Row>
    </div>
    <div>
      <!-- 认证审核显示提示 -->
      <div class="certificationState" v-show="parseInt(certification.status) === 0">
      	认证信息审核中，我们会在7个工作日内给你答复
      </div>
      <Row :gutter="24" class="row" v-show="certification.certification_name == 'org'">
      	<Col span="8" class="rowTitle">
      		机构名称
      	</Col>
      	<Col span="16">
      		{{ certification.data.org_name }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row" v-show="certification.certification_name == 'org'">
      	<Col span="8" class="rowTitle">
      		机构地址
      	</Col>
      	<Col span="16">
      		{{ certification.data.org_address }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row">
      	<Col span="8" class="rowTitle">
      		{{ certification.certification_name == 'user' ? '真实姓名' : '负责人' }} 
      	</Col>
      	<Col span="16">
      		{{ certification.data.name }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row">
      	<Col span="8" class="rowTitle">
      		身份证号码
      	</Col>
      	<Col span="16">
      		{{ certification.data.number }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row">
      	<Col span="8" class="rowTitle">
      		
      	{{ certification.certification_name == 'user' ? '手机号' : '负责人电话' }} 
      	</Col>
      	<Col span="16">
      		{{ certification.data.phone }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row">
      	<Col span="8" class="rowTitle">
      		认证描述
      	</Col>
      	<Col span="16">
      		{{ certification.data.desc }}
      	</Col>
      </Row>
      <Row :gutter="24" class="row">
      	<Col span="8" class="rowTitle">
      		认证资料
      	</Col>
      	<template v-for="file in files">
	      	<Col span="8">
	      	  <img v-lazy="getImage(file)" class="rowImage">
	      	</Col>
      	</template>
      </Row>
    </div>
  </div>
</template>
<script>
  import lodash from 'lodash';
  import BackIcon from '../icons/Back';
  import { NOTICE } from '../stores/types';
  import buildUrl from 'axios/lib/helpers/buildURL';
  import { goTo } from '../utils/changeUrl';
  import { getUserCertification } from '../utils/user';
  import { createAPI, addAccessToken } from '../utils/request';

  const showCertification = {
    components: { 
      BackIcon,
    },
    data: () => ({
      certification: {
      	status: null,
      	certification_name: null,
      	data: {
	      name: null,
	      number: null,
	      phone: null,
	      desc: null,
	      org_name: null,
	      org_address: null,
	      files: [],
      	},
      },
    }),
    computed: {
      /**
       * 认证类型
       */
      name () {
      	let name = this.certification.certification_name;
      	return name == 'user' ? '个人' : '企业';
      },
      /**
       * 认证资料
       */
      files () {
      	return this.certification.data.files;
      }
    },
    methods: {
      goTo,
      /**
       * 获取认证资料
       */
      getImage (id) {
      	return buildUrl(createAPI(`files/${id}`), {w: 100, h: 60});
      }
    },
    created () {
   	  // 获取认证信息
      getUserCertification().then(data => {
        this.certification = data;
      });
    }
  };
  export default showCertification;
</script>
<style lang="less" scoped>
	.row {
		height: 50px;
		line-height: 50px;
		.rowTitle {
		  color: #999;
		}
		.rowImage {
		  width: 100%;
		  height: 60px;
		}
	}
	.certificationState {
		background:#83cbb2;
		color:#fff;
		text-align:center;
		height:20px;
		line-height:20px;
		font-size:12px;
	}
</style>
