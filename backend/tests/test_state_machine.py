import pytest
from unittest.mock import MagicMock

from app.models.order import Order, OrderStatus
from app.services.state_machine import transition, InvalidTransitionError


def make_order(status: OrderStatus) -> Order:
    order = MagicMock(spec=Order)
    order.status = status
    return order


@pytest.mark.asyncio
async def test_valid_transition_en_attente_to_a_preparer():
    order = make_order(OrderStatus.EN_ATTENTE)
    result = await transition(order, OrderStatus.A_PREPARER)
    assert result.status == OrderStatus.A_PREPARER


@pytest.mark.asyncio
async def test_valid_transition_livree_to_validee():
    order = make_order(OrderStatus.LIVREE)
    result = await transition(order, OrderStatus.VALIDEE)
    assert result.status == OrderStatus.VALIDEE


@pytest.mark.asyncio
async def test_valid_transition_livree_to_litige():
    order = make_order(OrderStatus.LIVREE)
    result = await transition(order, OrderStatus.LITIGE)
    assert result.status == OrderStatus.LITIGE


@pytest.mark.asyncio
async def test_invalid_transition_raises():
    order = make_order(OrderStatus.TERMINEE)
    with pytest.raises(InvalidTransitionError):
        await transition(order, OrderStatus.EN_ATTENTE)


@pytest.mark.asyncio
async def test_invalid_transition_skip_steps():
    order = make_order(OrderStatus.EN_ATTENTE)
    with pytest.raises(InvalidTransitionError):
        await transition(order, OrderStatus.TERMINEE)


@pytest.mark.asyncio
async def test_all_terminal_states_have_no_transitions():
    terminal = [OrderStatus.TERMINEE, OrderStatus.REMBOURSEE, OrderStatus.ANNULEE]
    for state in terminal:
        order = make_order(state)
        for target in OrderStatus:
            with pytest.raises(InvalidTransitionError):
                await transition(order, target)
