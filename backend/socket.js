import User from "./models/user.model.js"

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        // on to get event eg here getting user identity event from frontend
        socket.on('identity', async ({ userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { new: true })
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('updateLocation', async ({ latitude, longitude, userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                })
                if (user) {
                    io.emit('updateDeliveryLocation', {
                        deliveryBoyId: userId,
                        latitude,
                        longitude
                    })
                }
            } catch (error) {
                console.log(`update delivery location using socket error: ${error}`)
            }
        })


        socket.on('disconnect', async () => {
            try {
                await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null, isOnline: false })
            } catch (error) {
                console.log(error);
            }
        })
    })
}