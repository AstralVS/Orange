import react from '@vitejs/plugin-react-swc';
import dns from 'dns';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/server-options.html#server-options
dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
            assets: '/src/assets',
            components: '/src/components',
            hooks: '/src/hooks',
            layouts: '/src/layouts',
            router: '/src/router',
            services: '/src/services',
            store: '/src/store',
            styles: '/src/styles',
            utils: '/src/utils',
            views: '/src/views'
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // Thêm thư mục 'src' vào danh sách đường dẫn Sass sẽ tìm kiếm
                    includePaths: [path.resolve(__dirname, 'src')]
                    // Bạn có thể thêm các đường dẫn khác nếu cần
                    // includePaths: [
                    //   path.resolve(__dirname, 'src'),
                    //   path.resolve(__dirname, 'node_modules/some-lib/styles')
                    // ],
                }
            }
        }
    },
    server: {
        port: 3000
    }
});
