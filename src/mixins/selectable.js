export default {
    data: function () {
        return {
            isSelected: false
        }
    },
    props: {
        isSelectable: {
            type: Boolean,
            default: true
        }
    },
}