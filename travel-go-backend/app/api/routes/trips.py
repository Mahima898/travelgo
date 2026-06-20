from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.trip import TripCreate, TripUpdate, TripResponse
from app.crud.trip import (
    get_all_trips_by_user,
    get_trip_by_id_and_user,
    create_trip,
    update_trip,
    delete_trip,
)
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("", response_model=List[TripResponse])
def get_my_trips(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all trips saved by the currently logged in user.
    Returns trips in descending order (newest first).
    Requires JWT token in Authorization header.
    """
    trips = get_all_trips_by_user(db, user_id=current_user.id)
    return trips


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single saved trip by ID.
    Returns 404 if trip not found.
    Returns 403 if trip belongs to another user.

    Path param:
    - trip_id: integer ID of the trip
    """
    trip = get_trip_by_id_and_user(
        db,
        trip_id=trip_id,
        user_id=current_user.id
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} not found."
        )
    return trip


@router.post(
    "",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED
)
def save_trip(
    trip_data: TripCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a new trip for the current user.
    user_id is taken from JWT token automatically.
    Returns the created trip with its new id.
    """
    
    if not trip_data.name or len(trip_data.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trip name must be at least 2 characters."
        )

    new_trip = create_trip(
        db,
        trip_data=trip_data,
        user_id=current_user.id
    )
    return new_trip


@router.put("/{trip_id}", response_model=TripResponse)
def update_my_trip(
    trip_id: int,
    update_data: TripUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a saved trip.
    Only the owner can update their trip.
    Only provided fields are updated.

    Path param:
    - trip_id: integer ID of the trip
    """
    
    trip = get_trip_by_id_and_user(
        db,
        trip_id=trip_id,
        user_id=current_user.id
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} not found."
        )

    updated_trip = update_trip(db, trip=trip, update_data=update_data)
    return updated_trip


@router.delete("/{trip_id}")
def delete_my_trip(
    trip_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a saved trip.
    Only the owner can delete their trip.
    Returns success message after deletion.

    Path param:
    - trip_id: integer ID of the trip
    """
    
    trip = get_trip_by_id_and_user(
        db,
        trip_id=trip_id,
        user_id=current_user.id
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with id {trip_id} not found."
        )

    delete_trip(db, trip=trip)

    return {
        "message": f"Trip '{trip.name}' deleted successfully.",
        "id": trip_id
    }