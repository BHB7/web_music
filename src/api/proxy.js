import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://proxy.vocucc.cn/api/search',
            params: req.query,
            headers: {
                // 如果需要设置额外的请求头，可以在这里配置
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
}
