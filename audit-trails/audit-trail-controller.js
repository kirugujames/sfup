import AuditTrail from "./Models/AuditTrail.js";
import { User } from "../auth/models/index.js";

// Log Action Utility
export async function logAction(user_id, action, description, entity, details, ip_address) {
    try {
        await AuditTrail.create({ user_id, action, description, entity, details, ip_address });
    } catch (err) {
        console.error("Failed to log audit trail:", err.message);
    }
}

// Get All Audit Trails (Admin)
export async function getAllAuditTrails() {
    try {
        const trails = await AuditTrail.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "username"], // username acts as name
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        const formattedTrails = trails.map((trail) => ({
            id: trail.id,
            user: trail.user ? { id: trail.user.id, name: trail.user.username } : null,
            action: trail.action,
            entity: trail.entity,
            description: trail.description,
            ipAddress: trail.ip_address,
            createdAt: trail.createdAt
        }));

        return { statusCode: 200, message: "Audit trails fetched successfully", data: formattedTrails };
    } catch (err) {
        console.error("getAllAuditTrails error:", err);
        return { statusCode: 500, message: err.message, data: null };
    }
}
