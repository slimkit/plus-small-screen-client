<template>
	<div :class="$style.locked">
		<section v-if="square" :class="$style.square">
			<img :src="defaultImage">
			<div>
				<LockIcon height="32" width="32" color="#fff" />
			</div>
		</section>
		<section v-else :class="$style.notSquare">
			<img :src="defaultImage" alt="">
			<div>
				<LockIcon height="32" width="32" color="#fff" />
			</div>
		</section>
	</div>
</template>

<style lang="less" module>
  .locked{
    position: absolute;s
    left: 0;
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
      }
    }
    .notSquare {
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
			}
		},
		computed: {
			defaultImage () {
				return this.square ? squareImage : image;
			}
		}
	};

	export default LockedImage;
</script>