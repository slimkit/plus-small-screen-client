import marked from 'marked';
import hljs from 'highlight.js';
// 自定义解析 图片
import plusImagePlugin from 'marked-plus-image';

const basename = '/api/v2/files';

marked.setOptions({
    basename,
    highlight: function(code) {
        return hljs ? hljs.highlightAuto(code).value : code;
    }
});

export default(content) => {
    return marked(plusImagePlugin(marked, content, { sanitize: true }));
};