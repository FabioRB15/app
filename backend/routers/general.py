from fastapi import APIRouter, HTTPException
import logging

from models import (
    PricingPlan, PricingPlanCreate, PricingPlanResponse,
    DashboardStat, DashboardStatsResponse,
    Testimonial, TestimonialCreate, TestimonialResponse,
    SupportRequest, SupportRequestCreate, SupportRequestResponse
)
from database import Database, db

router = APIRouter()
logger = logging.getLogger(__name__)

# Pricing Plans Endpoints
@router.get("/pricing-plans", response_model=PricingPlanResponse)
async def get_pricing_plans():
    """Get all pricing plans"""
    try:
        plans_cursor = db.pricing_plans.find()
        plans_list = await plans_cursor.to_list(1000)
        plans = [PricingPlan(**plan) for plan in plans_list]
        return PricingPlanResponse(plans=plans)
    except Exception as e:
        logger.error(f"Error fetching pricing plans: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/pricing-plans", response_model=PricingPlan)
async def create_pricing_plan(plan_data: PricingPlanCreate):
    """Create a new pricing plan"""
    try:
        plan = PricingPlan(**plan_data.dict())
        await db.pricing_plans.insert_one(plan.dict())
        return plan
    except Exception as e:
        logger.error(f"Error creating pricing plan: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Dashboard Statistics Endpoint
@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats():
    """Get real-time dashboard statistics"""
    try:
        stats = await Database.get_dashboard_stats()
        dashboard_stats = [DashboardStat(**stat) for stat in stats]
        return DashboardStatsResponse(stats=dashboard_stats)
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Testimonials Endpoints
@router.get("/testimonials", response_model=TestimonialResponse)
async def get_testimonials():
    """Get approved testimonials"""
    try:
        testimonials_cursor = db.testimonials.find({"approved": True})
        testimonials_list = await testimonials_cursor.to_list(1000)
        testimonials = [Testimonial(**testimonial) for testimonial in testimonials_list]
        return TestimonialResponse(testimonials=testimonials)
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial = Testimonial(**testimonial_data.dict())
        await db.testimonials.insert_one(testimonial.dict())
        return testimonial
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Support Endpoints
@router.post("/support/contact", response_model=SupportRequestResponse)
async def submit_support_request(request_data: SupportRequestCreate):
    """Submit a support request"""
    try:
        support_request = SupportRequest(**request_data.dict())
        await db.support_requests.insert_one(support_request.dict())
        
        return SupportRequestResponse(
            message="Support request submitted successfully",
            request_id=support_request.id
        )
    except Exception as e:
        logger.error(f"Error submitting support request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
