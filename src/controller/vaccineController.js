let userModel = require("../model/userModel")
let month = 1;
let year = 2023
const slotReg = async function (req, res) {
    try {
        const userId = req.params.userId;
        const doseNo = req.params.doseNo;
        const body = req.body;
        const userDetail = req.userDetail;
        let { date, time } = body;
        if (!date || !time) { return res.status(400).send({ status: false, message: "Give time, date  in the body" }) }
        time = time.split(":")
        if (!time[1]) { return res.status(400).send({ status: false, message: "Give `:` in between hour and minute in time formate HH:MM" }) }
        let hour = +time[0].trim()
        let minute = +time[1]
        if (1 <= hour && hour < 5) { hour = hour + 12 }                     //Conveting given time into Slot Time 
        if (!minute) { minute = 00 }
        if (minute > 30) {
            minute = 00;
            hour = hour + 1
        }
        else if (1 <= minute && minute <= 30) { minute = 30 }
        if ((!hour) || (hour > 17) || (hour < 10)) { return res.status(400).send({ status: false, message: "Hour will be in between 10-16 or 1-4 in time" }) }
        if (minute !== 0 || minute !== 30) { return res.status(400).send({ status: false, message: "Minute will be in Number" }) }
        if (hour == 17 && minute == 00) { return res.status(400).send({ status: false, message: "16:30 is the last time slot" }) }
        date = +date
        if (!date || date < 1 || date > 30) { return res.status(400).send({ status: false, message: "Give the date in between 1-30" }) }

        const slotTime = new Date(`${year}-${month}-${date} ${hour}:${minute}`); // Conveting date and Time into Date Format 
        console.log(slotTime.getTime());
        if (slotTime == `Invalid Date`) { return res.status(400).send({ status: false, message: "Time or Date is not valid" }) }


        if (doseNo != 1 && doseNo != 2) { return res.status(400).send({ status: false, message: "Give the doseNo 1 or 2" }) }
        if (doseNo == 1) {

            if (userDetail.firstDose && (userDetail.firstDose > new Date())) { return res.status(400).send({ status: false, message: `Your first Dose is already sheduled on: ${userDetail.firstDose.toString()}` }) }
            if (userDetail.firstDose && (userDetail.firstDose < new Date())) { return res.status(400).send({ status: false, message: `Your first Dose is already Completed on: ${userDetail.firstDose.toString()}` }) }
            if (slotTime < new Date()) { return res.status(400).send({ status: false, message: `Time slot is past` }) }

            let thatSlot = await userModel.find({ $or: [{ firstDose: slotTime }, { secondDose: slotTime }] })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }

            let dose1 = await userModel.findOneAndUpdate({ _id: userId }, { firstDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your First Dose is successfully sheduled on: ${dose1.firstDose.toString()}`, slot: `${hour}:${minute}` })

        }
        if (doseNo == 2) {
            if (!userDetail.firstDose) { return res.status(400).send({ status: false, message: `Your First Dose is not sheduled yet` }) }
            if (userDetail.secondDose && (userDetail.secondDose > new Date())) { return res.status(400).send({ status: false, message: `Your Second Dose is already sheduled on: ${userDetail.secondDose.toString()}` }) }
            if (userDetail.secondDose && (userDetail.secondDose < new Date())) { return res.status(400).send({ status: false, message: `Your Second Dose is already Completed on: ${userDetail.secondDose.toString()}` }) }
            if (slotTime < new Date()) { return res.status(400).send({ status: false, message: `Time slot is past` }) }

            if (userDetail.firstDose >= slotTime) { return res.status(400).send({ status: false, message: `Your First Dose sheduled on: ${userDetail.firstDose},Give a further time or date` }) }

            let thatSlot = await userModel.find({ $or: [{ firstDose: slotTime }, { secondDose: slotTime }] })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }
            let dose2 = await userModel.findOneAndUpdate({ _id: userId }, { secondDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your Second Dose is successfully sheduled on: ${dose2.secondDose.toString()}`, slot: `${hour}:${minute}` })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateSlot = async function (req, res) {
    try {
        const userId = req.params.userId;
        const doseNo = req.params.doseNo
        const body = req.body;
        const userDetail = req.userDetail;
        let { date, time } = body;
        if (!date || !time) { return res.status(400).send({ status: false, message: "Give time, date  in the body" }) }
        time = time.split(":")
        if (!time[1]) { return res.status(400).send({ status: false, message: "Give `:` in between hour and minute in time formate HH:MM" }) }
        let hour = +time[0].trim()
        let minute = +time[1].trim()                                //Conveting given time into Slot Time
        if (1 <= hour && hour < 5) { hour = hour + 12 }
        // if ( minute ) { return res.status(400).send({ status: false, message: "Minute will be in Number" }) }
        // if (!minute) { minute = 00 }
        if (minute > 30) {
            minute = 00;
            hour = hour + 1
        }
        else if (1 <= minute && minute <= 30) { minute = 30 }
        if ((!hour) || (hour > 17) || (hour < 10)) { return res.status(400).send({ status: false, message: "Hour will be in between 10-16 or 1-4 in time" }) }
        if (hour == 17 && minute == 00) { return res.status(400).send({ status: false, message: "16:30 is the last time slot" }) }
        date = +date
        if (!date || date < 1 || date > 30) { return res.status(400).send({ status: false, message: "Give the date in between 1-30" }) }

        const slotTime = new Date(`${year}-${month}-${date} ${hour}:${minute}`);

        console.log(slotTime.getTime());
        if (slotTime == `Invalid Date`) { return res.status(400).send({ status: false, message: "Time or Date is not valid" }) }

        let timeLimit = (Date.now()) - 86400000

        if (doseNo != 1 && doseNo != 2) { return res.status(400).send({ status: false, message: "Give the dose no 1 or 2" }) }
        if (doseNo == 1) {
            if (!userDetail.firstDose) { return res.status(400).send({ status: false, message: `You have not sheduled your First Dose before` }) }
            if (userDetail.firstDose < new Date()) { return res.status(400).send({ status: false, message: `Your first Dose is already Completed on: ${userDetail.firstDose.toString()}` }) }
            if (userDetail.firstDose == slotTime) { return res.status(400).send({ status: false, message: `Nothing to update your first dose slot already sheduled on: date-${userDetail.firstDose.toString()}`, slot: `${hour}:${minute}` }) }
            if (userDetail.secondDose <= slotTime) { return res.status(400).send({ status: false, message: `Your Second dose is already sheduled on: ${userDetail.secondDose.toString()}, So do it before otherwise reshedule the second dose` }) }
            if (userDetail.firstDose.getTime() < timeLimit) { return res.status(400).send({ status: false, message: `Limit of 24 Hours to update is over now ` }) }
            if (slotTime < new Date()) { return res.status(400).send({ status: false, message: `Time slot is past` }) }


            let thatSlot = await userModel.find({ $or: [{ firstDose: slotTime }, { secondDose: slotTime }] })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }

            let dose1 = await userModel.findOneAndUpdate({ _id: userId, firstDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your First Dose is successfully resheduled on: date-${dose1.firstDose.toString()}`, slot: `${hour}:${minute}` })
        }
        if (doseNo == 2) {
            if (!userDetail.secondDose) { return res.status(400).send({ status: false, message: `You have not sheduled your Second Dose before` }) }
            if (userDetail.secondDose < new Date()) { return res.status(400).send({ status: false, message: `Your Second Dose is already Completed on: ${userDetail.secondDose.toString()}` }) }
            if (userDetail.secondDose == slotTime) { return res.status(400).send({ status: false, message: `Nothing to update your second dose already sheduled on: date-${userDetail.secondDose.toString()}`, slot: `${hour}:${minute}` }) }
            if (userDetail.secondDose.getTime() < timeLimit) { return res.status(400).send({ status: false, message: `Limit of 24 Hours to update is over now ` }) }
            if (slotTime < new Date()) { return res.status(400).send({ status: false, message: `Time slot is past` }) }

            let thatSlot = await userModel.find({ $or: [{ firstDose: slotTime }, { secondDose: slotTime }] })
            if (thatSlot.length >= 10) { return res.status(400).send({ status: false, message: `date-${date},slot- ${hour}:${minute} is already full` }) }

            let dose2 = await userModel.findOneAndUpdate({ _id: userId, secondDose: slotTime }, { new: true })
            return res.status(200).send({ status: true, message: `Your Second Dose is successfully resheduled on: date-${dose2.secondDose.toString()},slot- ${hour}:${minute}` })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getByAdmin = async function (req, res) {
    try {
        if (req.params.userId != "63b1a25682e679457db91289") { return res.status(401).send({ status: false, message: "You are not the Admin" }) }
        let data = req.query
        let doseNo = data.doseNo
        let query = { age, pincode } = data
        let { date, endDate } = data
        let all = await userModel.find({ ...query })

        if (!date && !endDate) {
            date = 1;
            endDate = 30
        }
        else if (!date) { date = 1 }
        if (endDate) { endDate = +endDate + 1 }
        else { endDate = +date + 1 }
        date = +date
        const startDate = new Date(`${year}-${month}-${date}`);
        const dateEnd = new Date(`${year}-${month}-${endDate}`);

        if (startDate == "Invalid Date") { return res.status(400).send({ status: false, message: "Give date in Number in between 1 - 30" }) }
        if (dateEnd == "Invalid Date") { return res.status(400).send({ status: false, message: "Give endDate in Number in between 1 - 30" }) }

        // const timeSlots = []
        const finalArr = []

        let dose1Walo = all.filter((j) => { return (j.firstDose && startDate < j.firstDose && j.firstDose < dateEnd) })
        let dose2Walo = all.filter((k) => { return (k.secondDose && startDate < k.secondDose && k.secondDose < dateEnd) })

        let filterData = dose1Walo.concat(dose2Walo)

        for (let index = 0; index < endDate - date; index++) {
            let hour = 9;
            let minute = 00;
            let oneDate = date + index
            const timeS1 = new Date(`${year}-${month}-${oneDate} ${10}:${00}`)
            const objOfSlots = { day: oneDate, doseNo: doseNo }

            for (let i = 0; i < 14; i++) {
                let newRoTime = new Date(timeS1.getTime() + (1000 * 60 * 30 * i))
                // timeSlots.push(newRoTime)

                if (i % 2 == 0) {
                    minute = "00";
                    hour = hour + 1
                }
                else { minute = 30 }

                let timeFormat = `${hour}:${minute}`

                if (doseNo == 1) {
                    objOfSlots[timeFormat] = (dose1Walo.filter((l) => { return (newRoTime == l.firstDose) })).length
                }
                if (doseNo == 2) {
                    objOfSlots[timeFormat] = (dose2Walo.filter((l) => { return (newRoTime == l.secondDose) })).length
                }
                if (!doseNo) {
                    objOfSlots[timeFormat] = (filterData.filter((l) => { return (newRoTime == l.firstDose || newRoTime == l.secondDose) })).length
                }
            }
            finalArr.push(objOfSlots)
        }
        return res.status(200).send({ status: true, data: finalArr })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }


}

let availableSlots = async function (req, res) {
    try {
        let { date, endDate } = req.query
        if (!date && !endDate) {
            date = 1;
            endDate = 30
        }
        else if (!date) { date = 1 }
        if (endDate) {
            endDate = endDate + 1
        } else { endDate = date + 1 }

        const startDate = new Date(`${year}-${month}-${date}`);
        const dateEnd = new Date(`${year}-${month}-${endDate}`);

        if (startDate == "Invalid Date") { return res.status(400).send({ status: false, message: "Give date in Number in between 1 - 30" }) }
        if (dateEnd == "Invalid Date") { return res.status(400).send({ status: false, message: "Give endDate in Number in between 1 - 30" }) }

        // const timeSlots = []
        const finalArr = []
        let all = await userModel.find()

        let dose1Walo = all.filter((j) => { return (j.firstDose && startDate < j.firstDose && j.firstDose < dateEnd) })
        let dose2Walo = all.filter((k) => { return (k.secondDose && startDate < k.secondDose && k.secondDose < dateEnd) })

        let filterData = dose1Walo.concat(dose2Walo)

        for (let index = 0; index < endDate - date; index++) {
            let hour = 9;
            let minute = 00;
            let oneDate = date + index
            const timeS1 = new Date(`${year}-${month}-${oneDate} ${10}:${00}`)
            const objOfSlots = { day: oneDate }

            for (let i = 0; i < 14; i++) {
                let newRoTime = new Date(timeS1.getTime() + (1000 * 60 * 30 * i))
                // timeSlots.push(newRoTime)

                if (i % 2 == 0) {
                    minute = "00";
                    hour = hour + 1
                }
                else { minute = 30 }

                let timeFormat = `${hour}:${minute}`

                let bOm = filterData.filter((l) => { return (newRoTime == l.firstDose || newRoTime == l.secondDose) })
                if (bOm.length < 10) {
                    objOfSlots[timeFormat] = "OPEN"
                } else {
                    objOfSlots[timeFormat] = "CLOSED"
                }

            }

            finalArr.push(objOfSlots)
        }

        res.status(200).send({ status: true, data: finalArr })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { slotReg, updateSlot, getByAdmin, availableSlots }