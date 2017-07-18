<template>
	<div :class="{ locked: !single , singleLocked: single }" @click.stop="showBy();">
		<section v-if="square" class="square">
			<img :src="defaultImage">
			<div>
				<LockIcon height="24" width="24" color="#fff" />
			</div>
		</section>
		<section v-else class="notSquare">
			<img :src="defaultImage" alt="">
			<div>
				<LockIcon height="24" width="24" color="#fff" />
			</div>
		</section>
	</div>
</template>

<style lang="less" scoped>
  .singleLocked {
    .notSquare {
      position: relative;
      overflow: hidden;
      max-height: 80vw;
      div {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          display: block;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    
  }
  .locked{
    position: absolute;
    left: 2px;
    right: 0;
    top: 0;
    bottom: 0;
    .square {
      position: relative;
      div {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .notSquare {
      position: relative;
      height: 100%;
      div {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
</style>

<script>
	import LockIcon from '../icons/Lock';
	import { resolveImage } from '../utils/resource';

	const squareImage = resolveImage(require('../statics/images/pic_locked_square_bg.png'));
	const image = resolveImage(require('../statics/images/pic_locked_bg.png'));
	
	const LockedImage = {
		components: {
			LockIcon
		},
		props: {
			// 是否是正方形
			square: {
				type: Boolean,
				default: false
			},
      single: {
        type: Boolean,
        default: false
      }
		},
		computed: {
			defaultImage () {
				return this.square ? squareImage : image;
			}
		},
    methods: {
      showBy() {
        alert('By First');
        return;
      }
    }
	};

	export default LockedImage;
</script>