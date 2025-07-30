import sys
import os
sys.path.append(os.path.abspath(".."))  # trỏ về thư mục backend/

from services.recommendation_service import get_recommendations
from pprint import pprint

user_id = "685a262f16f06795ff04d36e"
recommendations = get_recommendations(user_id=user_id, limit=10)

print("✅ Recommendation result:")
pprint(recommendations)
