import { getLiveStation } from "../../../Services/IRCTC/liveStationService.js";
import IrctcSearchLog from "../../../Models/IrctcSearchLog.js";

export const fetchLiveStation = async (req, res) => {
  const { fromStationCode, toStationCode, hours } = req.query;

  if (!fromStationCode || !toStationCode || !hours) {
    return res
      .status(400)
      .json({
        error: "fromStationCode, toStationCode, and hours are required",
      });
  }

  try {
    const data = await getLiveStation(fromStationCode, toStationCode, hours);
    IrctcSearchLog.create({ fromStationCode, toStationCode, hours, user: req.user?._id || null, success: true })
      .catch((e) => console.error('[IrctcSearchLog]', e.message));
    res.json(data);
  } catch (error) {
    console.error('Error fetching LiveStation', error)
    IrctcSearchLog.create({ fromStationCode, toStationCode, hours, user: req.user?._id || null, success: false, errorMessage: error.message })
      .catch((e) => console.error('[IrctcSearchLog]', e.message));
    res.status(500).json({error: 'Failed to fetch live station data'})
  }
};
