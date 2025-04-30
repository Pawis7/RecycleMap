import { StyleSheet, View } from "react-native"
import { PinchGestureHandler } from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const MapZoomableView = ({ mapSource }) => {
  // Valores para la animación del zoom
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const lastScale = useSharedValue(1)
  const lastTranslateX = useSharedValue(0)
  const lastTranslateY = useSharedValue(0)

  // Manejador del gesto de pellizco
  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = lastScale.value
      ctx.startTranslateX = lastTranslateX.value
      ctx.startTranslateY = lastTranslateY.value
    },
    onActive: (event, ctx) => {
      // Calcular la nueva escala basada en la escala inicial y el evento
      scale.value = Math.min(Math.max(ctx.startScale * event.scale, 1), 3)

      // Ajustar la posición para que el zoom sea centrado en el punto de pellizco
      if (scale.value > 1) {
        translateX.value = ctx.startTranslateX + event.focalX - event.focalX * event.scale
        translateY.value = ctx.startTranslateY + event.focalY - event.focalY * event.scale
      }
    },
    onEnd: () => {
      // Guardar la escala y posición actuales para el próximo gesto
      lastScale.value = scale.value
      lastTranslateX.value = translateX.value
      lastTranslateY.value = translateY.value

      // Si la escala es muy cercana a 1, resetear a 1 con animación
      if (scale.value < 1.1) {
        scale.value = withTiming(1)
        translateX.value = withTiming(0)
        translateY.value = withTiming(0)
        lastScale.value = 1
        lastTranslateX.value = 0
        lastTranslateY.value = 0
      }
    },
  })

  // Estilo animado para la imagen
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    }
  })

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={styles.animatedContainer}>
          <Animated.Image source={mapSource} style={[styles.mapImage, animatedImageStyle]} resizeMode="cover" />
        </Animated.View>
      </PinchGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    borderRadius: 16,
  },
  animatedContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
})

export default MapZoomableView
