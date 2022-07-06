<template>
    <div>
        <h1>入力フォーム</h1>
        <form>
            <!-- date <input v-model="receipt.date" placeholder="date"><br> -->
            total <input v-model="total_price" placeholder="total"><br>
            <!-- ボタンの処理をvueで書く。formの外に書く！ -->
        </form>
        <div v-for="detail in receipt.details" v-bind:key="detail.id">
        <detail-form v-bind="detail"></detail-form>
        </div>
        <button v-on:click="addFrom">フォームを追加</button>
        <button v-on:click="postData">データベースに保存</button>
    </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'
import DetailForm from '@/components/Inputs/DetailForm';

export default {
    name: 'upload',
    components: {
        DetailForm,
    },
    data () {
        return {
            receipt: {
                // date: '2022/05/21 17:32:44',
                total: 0,
                details: [{
                food_name: 'hakusai',
                amount: 1,
                price: 120,
                subtotal: 120
                }]
            }
        }
    },
    computed: {
        total_price () {
            let res = 0;
            let list = this.receipt.details;
            for (let i=0; i<list.length; i++) {
                res += list[i].subtotal
            }
            return res;
        },
        user_id () {
            console.log("your userID is " + this.$store.state.user.currentUser.id);
            return this.$store.state.user.currentUser.id;
        },
    },
    methods: {
        addFrom () {
            // v-forで繰り返す回数を制御？
            // dataで制御しているdetailsリストにからのJSONを追加
            this.receipt.details.push({
                food_name: 'tofu',
                amount: 3,
                price: 50,
                subtotal: 150,
                })
        },
        async postData () {
            // 非同期でAPIに接続
            // api/insert.jsにpost接続してreqを渡す
            this.receipt['user_id'] = this.user_id;
            this.receipt['total'] = this.total_price;
            const res = await this.$axios.post('/insert', this.receipt).then(res => {
                console.log('res', res);
                return;
            }).catch(err => {
                return error.response
            })
        },
    }
}
</script>
