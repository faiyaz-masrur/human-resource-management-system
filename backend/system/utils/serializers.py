from rest_framework import serializers

class SmartUpdateSerializer(serializers.ModelSerializer):
    """
    A base serializer that only updates fields whose values have actually changed.
    Works even if the client sends all fields (changed + unchanged).
    """
    def update(self, instance, validated_data):
        changed_fields = []

        for field, new_value in validated_data.items():
            old_value = getattr(instance, field, None)
            if old_value != new_value:
                setattr(instance, field, new_value)
                changed_fields.append(field)

        if changed_fields:
            instance.save(update_fields=changed_fields)

        return instance
