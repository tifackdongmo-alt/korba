from app.models.order import Order, OrderStatus, VALID_TRANSITIONS


class InvalidTransitionError(Exception):
    def __init__(self, from_status: OrderStatus, to_status: OrderStatus):
        super().__init__(f"Transition interdite : {from_status} → {to_status}")
        self.from_status = from_status
        self.to_status = to_status


def validate_transition(order: Order, new_status: OrderStatus) -> None:
    allowed = VALID_TRANSITIONS.get(order.status, [])
    if new_status not in allowed:
        raise InvalidTransitionError(order.status, new_status)


async def transition(order: Order, new_status: OrderStatus) -> Order:
    validate_transition(order, new_status)
    order.status = new_status
    return order
