export default {
    currentDate: () => {
        const today = new Date();
        return `${addZero(today.getDate())}.${addZero(today.getMonth()+1)}.${today.getFullYear()}`;
        // today.getFullYear()+'-'+(this.addZero(today.getMonth()+1))+'-'+this.addZero(today.getDate());

        function addZero (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }
}
