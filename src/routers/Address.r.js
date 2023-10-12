const AddressC = require("../controllers/Address.c");
const router = require("express").Router();

router.post("/api/add", AddressC.AddAddress);
router.get("/api/get", AddressC.GetAddresses);
router.get("/api/get-default", AddressC.GetDefaultAddress);
router.put("/api/update", AddressC.UpdateAddress);
router.put("/api/set-default", AddressC.SetDefaultAddress);
router.delete("/api/delete", AddressC.DeleteAddress);

module.exports = router;
