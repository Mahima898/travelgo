from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.destination import DestinationResponse
from app.crud.destination import (
    get_all_destinations,
    get_destination_by_id,
)

router = APIRouter()


@router.get("", response_model=List[DestinationResponse])
def get_destinations(db: Session = Depends(get_db)):
    """
    Get all destinations.
    Returns list of all destinations in the database.
    """
    return get_all_destinations(db)


@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination(
    destination_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single destination by its ID.
    Used by DestinationDetail page.

    Path param:
    - destination_id: integer ID of the destination
    """
    destination = get_destination_by_id(db, destination_id)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id {destination_id} not found."
        )
    return destination