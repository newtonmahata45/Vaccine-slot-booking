let userModel = require("../model/userModel")


let bOm = async function () {

    return await userModel.find()
}
let all = bOm()



const slotReg = async function (req, res) {
    try {
        const userId = req.params.userId
        const body = req.body;
        const userDetail = req.userDetail;
        let { date, time, doseNo } = body;
        if (!date || !time || !doseNo) { return res.status(400).send({ status: false, message: "Give time, date and doseNo in the body" }) }
        time = time.split(":")
        if (!time[1]) { return res.status(400).send({ status: false, message: "Give `:` in between hour and minute in time formate hour:minute" }) }
        let hour = +time[0]
        let minute = +time[1]
        if (1 <= hour < 5) { hour = hour + 12 }
        if (!minute) { minute = 00 }
        if (minute > 30) {
            minute = 00;
            hour = hour + 1
        }
        else if (1 <= minute <= 30) { minute = 30 }
        if (!hour || hour > 17 || hour < 10) { return res.status(400).send({ status: false, message: "Hour will be in between 10-16 or 1-4 in time" }) }
        if (hour == 17 && minute == 30) { return res.status(400).send({ status: false, message: "16:30 is the last time slot" }) }
        date = +date
        if (!date || date < 1 || date > 30) { return res.status(400).send({ status: false, message: "Give the date in between 1-30" }) }

        const slotTime = new Date(`${2023}-${01}-${date} ${hour}:${minute}`);
        console.log(slotTime.getTime());
        if (slotTime == `Invalid Date`) { return res.status(400).send({ status: false, message: "Time or Date is not valid" }) }


        if (doseNo != 1 && doseNo != 2) { return res.status(400).send({ status: false, message: "Give the dose no 1 or 2" }) }
        if (doseNo == 1) {
            if (userDetail.firstDose && (userDetail.firstDose > new Date())) { return res.status(400).send({ status: false, message: `Your first Dose is already sheduled on: ${userDetail.firstDose}` }) }
            if (userDetail.firstDose && (userDetail.firstDose < new Date())) { return res.status(400).send({ status: false, message: `Your first Dose is already Completed on: ${userDetail.firstDose}` }) }

            let thatSlot = await userModel.find({ $or: { firstDose: slotTime, secondDose: slotTime } })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }

            let dose1 = await userModel.findOneAndUpdate({ _id: userId }, { firstDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your First Dose is successfully sheduled on: ${dose1.firstDose}` })

        }
        if (doseNo == 2) {
            if (!userDetail.firstDose) { return res.status(400).send({ status: false, message: `Your First Dose is not sheduled yet` }) }
            if (userDetail.secondDose && (userDetail.secondDose > new Date())) { return res.status(400).send({ status: false, message: `Your Second Dose is already sheduled on: ${userDetail.secondDose}` }) }
            if (userDetail.secondDose && (userDetail.secondDose < new Date())) { return res.status(400).send({ status: false, message: `Your Second Dose is already Completed on: ${userDetail.secondDose}` }) }
            if (userDetail.firstDose >= slotTime) { return res.status(400).send({ status: false, message: `Your First Dose sheduled on: ${userDetail.firstDose},Give a further time or date` }) }

            let thatSlot = await userModel.find({ $or: { firstDose: slotTime, secondDose: slotTime } })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }
            let dose2 = await userModel.findOneAndUpdate({ _id: userId }, { secondDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your Second Dose is successfully sheduled on: ${dose2.secondDose}` })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateSlot = async function (req, res) {
    const userId = req.params.userId
    const body = req.body;
    const userDetail = req.userDetail;
    let { date, time, doseNo } = body;
    if (!date || !time || !doseNo) { return res.status(400).send({ status: false, message: "Give the time, date and doseNo when you want to update" }) }

    time = time.split(":")
    if (!time[1]) { return res.status(400).send({ status: false, message: "Give `:` in between hour and minute in time, formate hour:minute" }) }
    let hour = +time[0]
    let minute = +time[1]
    if (1 <= hour < 5) { hour = hour + 12 }
    if (!minute) { minute = 00 }
    if (minute > 30) {
        minute = 00;
        hour = hour + 1
    }
    else if (1 <= minute <= 30) { minute = 30 }
    if (!hour || hour > 16) { return res.status(400).send({ status: false, message: "Hour will be in between 10-16 or 1-4 in time" }) }
    date = +date
    if (!date || date < 1 || date > 30) { return res.status(400).send({ status: false, message: "Give the date in between 1-30" }) }

    let theTime = `${2023}-${01}-${date} ${hour}:${minute}`;
    const slotTime = new Date(theTime);

    console.log(slotTime.getTime());
    if (slotTime == `Invalid Date`) { return res.status(400).send({ status: false, message: "Time and Date is not valid" }) }

    let timeLimit = (Date.now()) - 86400000

    if (doseNo != 1 && doseNo != 2) { return res.status(400).send({ status: false, message: "Give the dose no 1 or 2" }) }
    if (doseNo == 1) {
        if (!userDetail.firstDose) { return res.status(400).send({ status: false, message: `You have not sheduled your First Dose before` }) }
        if (userDetail.firstDose < new Date()) { return res.status(400).send({ status: false, message: `Your first Dose is already Completed on: ${userDetail.firstDose}` }) }
        if (userDetail.firstDose == slotTime) { return res.status(400).send({ status: false, message: `Nothing to update your first dose slot already sheduled on: ${slotTime}` }) }
        if (userDetail.secondDose <= slotTime) { return res.status(400).send({ status: false, message: `Your Second dose is already sheduled on: ${userDetail.secondDose}, So do it before otherwise reshedule the second dose` }) }
        if (userDetail.firstDose.getTime() < timeLimit) { return res.status(400).send({ status: false, message: `Limit of 24 Hours to update is over now ` }) }
        
        let thatSlot = await userModel.find({ $or: { firstDose: slotTime, secondDose: slotTime } })
        if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }
        
        let dose1 = await userModel.findOneAndUpdate({ _id: userId, firstDose: slotTime }, { new: true })
        return res.status(200).send({ status: true, message: `Your First Dose is successfully resheduled on: ${dose1.firstDose}` })
    }
    if (doseNo == 2) {
        if (!userDetail.secondDose) { return res.status(400).send({ status: false, message: `You have not sheduled your Second Dose before` }) }
        if (userDetail.secondDose < new Date()) { return res.status(400).send({ status: false, message: `Your Second Dose is already Completed on: ${userDetail.secondDose}` }) }
        if (userDetail.secondDose == slotTime) { return res.status(400).send({ status: false, message: `Nothing to update your second dose already sheduled on: ${slotTime}` }) }
        if (userDetail.secondDose.getTime() < timeLimit) { return res.status(400).send({ status: false, message: `Limit of 24 Hours to update is over now ` }) }
        let dose2 = await userModel.findOneAndUpdate({ _id: userId, secondDose: slotTime }, { new: true })
        return res.status(200).send({ status: true, message: `Your Second Dose is successfully resheduled on: ${dose2.secondDose}` })

    }

}

let getByAdmin = async function (req, res) {
    let data = req.query
    let query = { age, pincode } = data

    let all = await userModel.find({ ...query })
    query.datas = all
    if (data.doseNo && (data.doseNo != (0 && 1 && 2))) { return res.status(400).send({ status: false, message: "In doseNo write 0 for noVaccineted, 1 for Only 1st doses, 2 for all completed" }) }
    if (data.doseNo == 0) {
        let noDose = all.filter((i) => { return !i.firstDose })
        query.datas = noDose
    } else if (data.doseNo == 1) {
        let onlyFistDose = all.filter((i) => { return (i.firstDose && !i.secondDose) })
        query.datas = onlyFistDose
    }
    else if (data.doseNo == 2) {
        let bothDosesComplete = all.filter((i) => { return i.secondDose })
        query.datas = bothDosesComplete
    }
    return res.status(200).send({ status: true, message: `Success`, data: query.datas })
}

let availableSlots = async function (req, res) {
    let { date, endDate } = req.query
    if (!date && !endDate) {
        date = 1;
        endDate = 30
    }
    else if (!date) { date = 1 }
    if (endDate) {
        endDate = endDate + 1
    } else { endDate = date + 1 }

    const startDate = new Date(`${2023}-${01}-${date}`);
    const dateEnd = new Date(`${2023}-${01}-${endDate}`)

    if (startDate == "Invalid Date") { return res.status(400).send({ status: false, message: "Give date in Number in between 1 - 30" }) }
    if (dateEnd == "Invalid Date") { return res.status(400).send({ status: false, message: "Give endDate in Number in between 1 - 30" }) }

    const timeSlots = []
    const finalArr = []

    let dose1Walo = all.filter((j) => { return (j.firstDose && startDate < j.firstDose < dateEnd) })
    let dose2Walo = all.filter((k) => { return (k.secondDose && startDate < k.secondDose < dateEnd) })

    let filterData = dose1Walo.concat(dose2Walo)

    for (let index = 0; index < endDate - date; index++) {
        let hour = 9;
        let minute = 00;
        let oneDate = date + index
        const timeS1 = new Date(`${2023}-${01}-${oneDate} ${10}:${00}`)
        const objOfSlots = { day: oneDate }

        for (let i = 0; i < 14; i++) {
            let newRoTime = new Date(timeS1.getTime() + (1000 * 60 * 30 * i))
            timeSlots.push(newRoTime)

            if (i % 2 == 0) {
                minute = "00";
                hour = hour + 1
            }
            else { minute = 30 }

            let timeFormat = `${hour}:${minute}`

            objOfSlots[timeFormat] = 10 - (filterData.filter((l) => { return (newRoTime == (l.firstDose || l.secondDose)) })).length
        }

        finalArr.push(objOfSlots)

    }

    res.status(200).send({ status: true, data: finalArr })

    // delete objOfSlots[`slot${j+1}`]
    // objOfSlots[`slot${i+1}`] = 10 - (allInDate.filter((j) => { return (timeSlots[i] == (j.firstDose || j.secondDose)) })).length
    const dayStart = new Date(`${2023}-${01}-${date} ${00}:${00}`);
    const dayEnd = new Date(endDate);
    let allInDate = await userModel.find({ $gt: { $or: { firstDose: dayStart, secondDose: dayStart } }, $lt: { $or: { firstDose: dayEnd, secondDose: dayEnd } } })

    let slot1 = allInDate.filter((i) => { return (timeSlots[0] == (i.firstDose || i.secondDose)) })
    let slot2 = allInDate.filter((i) => { return (timeSlots[1] == (i.firstDose || i.secondDose)) })
    let slot3 = allInDate.filter((i) => { return (timeSlots[2] == (i.firstDose || i.secondDose)) })
    let slot4 = allInDate.filter((i) => { return (timeSlots[3] == (i.firstDose || i.secondDose)) })
    let slot5 = allInDate.filter((i) => { return (timeSlots[4] == (i.firstDose || i.secondDose)) })
    let slot6 = allInDate.filter((i) => { return (timeSlots[5] == (i.firstDose || i.secondDose)) })
    let slot7 = allInDate.filter((i) => { return (timeSlots[6] == (i.firstDose || i.secondDose)) })
    let slot8 = allInDate.filter((i) => { return (timeSlots[7] == (i.firstDose || i.secondDose)) })
    let slot9 = allInDate.filter((i) => { return (timeSlots[8] == (i.firstDose || i.secondDose)) })
    let slot10 = allInDate.filter((i) => { return (timeSlots[9] == (i.firstDose || i.secondDose)) })
    let slot11 = allInDate.filter((i) => { return (timeSlots[10] == (i.firstDose || i.secondDose)) })
    let slot12 = allInDate.filter((i) => { return (timeSlots[11] == (i.firstDose || i.secondDose)) })
    let slot13 = allInDate.filter((i) => { return (timeSlots[12] == (i.firstDose || i.secondDose)) })
    let slot14 = allInDate.filter((i) => { return (timeSlots[13] == (i.firstDose || i.secondDose)) })



}


module.exports = { slotReg, updateSlot, getByAdmin, availableSlots }