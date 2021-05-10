let daysLab:string[]=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
let months:string[]=['janvier','fevrier','mars','avril','may','juin','juillet','aout','septembre','octobre','novembre','decembre'];

export const dateAccess={
    getPositionOfMonth:(month:string)=>{
        return months.findIndex((item)=>item==month.toLowerCase());
    },
    getMonthFromPosition:(position)=> months[position]
};