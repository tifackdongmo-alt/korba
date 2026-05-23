import pytest
from app.services.assignment import _compute_score, _distance_score


def test_distance_score_zero():
    assert _distance_score(0) == 30.0


def test_distance_score_max():
    assert _distance_score(5000) == 0.0


def test_distance_score_half():
    assert abs(_distance_score(2500) - 15.0) < 0.01


def test_distance_score_beyond_max():
    assert _distance_score(10000) == 0.0


def test_compute_score_perfect():
    score = _compute_score(
        distance_m=0,
        rating=5.0,
        acceptance_rate=1.0,
        success_rate=1.0,
        is_favorite=True,
        vehicle_matches=True,
        vendor_deliveries=50,
    )
    assert score == 100.0


def test_compute_score_new_driver():
    score = _compute_score(
        distance_m=2000,
        rating=5.0,
        acceptance_rate=1.0,
        success_rate=1.0,
        is_favorite=False,
        vehicle_matches=True,
        vendor_deliveries=0,
    )
    # 30*(1-2000/5000) + 20 + 15 + 15 + 0 + 5 + 0 = 18 + 55 = 73
    assert abs(score - 73.0) < 0.1


def test_compute_score_low_rating():
    score = _compute_score(
        distance_m=0,
        rating=2.0,
        acceptance_rate=0.5,
        success_rate=0.8,
        is_favorite=False,
        vehicle_matches=False,
        vendor_deliveries=0,
    )
    # 30 + 8 + 7.5 + 12 + 0 + 0 + 0 = 57.5
    assert abs(score - 57.5) < 0.1
