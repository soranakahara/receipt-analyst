export const state = () => ({
    // userが切り替わると変わる（暫定的にtanakaで固定）→mutationsで制御
    currentUser: {id:1, name:'tanaka'}
});

export const mutations = {
    add(state, text) {
        state.list.push({
        text,
        done: false
        })
    },
    remove(state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1)
    },
    toggle(state, todo) {
        todo.done = !todo.done
    }
}